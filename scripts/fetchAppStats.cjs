const gplay = require('google-play-scraper').default || require('google-play-scraper');
const appStore = require('app-store-scraper');
const fs = require('fs');
const path = require('path');

const projects = [
    { id: 'bybus', playId: 'com.bybus.passenger', appStoreId: '6504498504' },
    { id: 'sawa', playId: 'com.fusion.sawa', appStoreId: '1645381223' },
    { id: 'wird', playId: 'com.quran.wird', appStoreId: '6759871577' },
    { id: 'kumquaty', playId: 'com.kian.kumquatyUser', appStoreId: '6471918075' },
    { id: 'engtracks', playId: 'com.phonegap.engTracks', appStoreId: '1543736435' },
    { id: 'aplus', playId: 'com.sellx.aplus_student', appStoreId: '1543956025' },
    { id: 'teksa', playId: 'com.Teksa.teksa', appStoreId: '6483865247' },
    { id: 'sadakat', playId: 'sa.aait.aspbranch.hassanat' },
    { id: 'gene', appStoreId: '6743855109' },
    { id: 'shahia', appStoreId: '6744401579' }
];

function formatNumber(num) {
    if (!num || isNaN(num)) return null;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K+';
    return num.toString();
}

function formatDownloads(installs) {
    if (!installs) return null;
    // Play Store often returns "10,000+"
    let clean = installs.replace(/,/g, '').replace(/\+/g, '');
    let num = parseInt(clean);
    if (isNaN(num)) return installs;
    return formatNumber(num);
}

async function fetchStats() {
    const results = {};

    for (const project of projects) {
        console.log(`Fetching stats for ${project.id}...`);
        results[project.id] = {
            lastUpdated: new Date().toISOString()
        };

        let playData = null;
        let appData = null;

        if (project.playId) {
            try {
                playData = await gplay.app({ appId: project.playId, country: 'eg' });
            } catch (e) {
                console.error(`Error fetching Play Store data for ${project.id}: ${e.message}`);
            }
        }

        if (project.appStoreId) {
            try {
                // app-store-scraper country defaults to 'us', but we can try 'eg'
                appData = await appStore.app({ id: project.appStoreId, country: 'eg' });
            } catch (e) {
                try {
                    // Fallback to 'us' if 'eg' fails
                    appData = await appStore.app({ id: project.appStoreId, country: 'us' });
                } catch (e2) {
                    console.error(`Error fetching App Store data for ${project.id}: ${e2.message}`);
                }
            }
        }

        // Aggregate data
        let downloads = null;
        let rating = 0;
        let reviews = 0;
        let count = 0;

        if (playData) {
            downloads = formatDownloads(playData.installs);
            if (playData.score > 0) {
                rating += playData.score;
                reviews += (playData.reviews || 0);
                count++;
            }
        }

        if (appData) {
            if (!downloads) downloads = "Not publicly available";
            if (appData.score > 0) {
                rating += appData.score;
                reviews += (appData.reviews || 0);
                count++;
            }
        }

        if (downloads) results[project.id].downloads = downloads;
        if (count > 0) {
            results[project.id].rating = (rating / count).toFixed(1);
            if (reviews > 0) results[project.id].reviews = formatNumber(reviews);
        }
    }

    // Clean up empty objects
    const finalResults = {};
    for (const id in results) {
        if (Object.keys(results[id]).length > 1) { // More than just lastUpdated
            finalResults[id] = results[id];
        }
    }

    const outputPath = path.join(__dirname, '../src/data/appStats.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalResults, null, 2));
    console.log(`Stats saved to ${outputPath}`);
}

fetchStats();

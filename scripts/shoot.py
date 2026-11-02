"""Headless QA: console errors + desktop/mobile screenshots. Usage: python3 scripts/shoot.py [url]"""
import sys, asyncio, os
from playwright.async_api import async_playwright
URL = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4173/'
OUT = os.path.join(os.path.dirname(__file__), '..', 'screenshots')
SHOTS = [('01-hero', 0), ('02-descent-mid', 0.45), ('03-descent-end', 0.95), ('04-dasha', 1.55), ('05-tools', None, '#tools'), ('06-how', None, '#how'), ('07-why', None, '#why'), ('08-cta', None, '#begin'), ('09-footer', 'end')]
async def run(p, name, vp, mobile):
    b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    ctx = await b.new_context(viewport=vp, device_scale_factor=1 if not mobile else 2, is_mobile=mobile, has_touch=mobile)
    pg = await ctx.new_page(); errs = []
    pg.on('console', lambda m: errs.append(f'{m.type}: {m.text}') if m.type in ('error', 'warning') else None)
    pg.on('pageerror', lambda e: errs.append(f'pageerror: {e}'))
    await pg.goto(URL, wait_until='networkidle'); await pg.wait_for_timeout(4000)
    vh = vp['height']
    for s in SHOTS:
        if s[1] == 'end': await pg.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        elif s[1] is None: await pg.evaluate(f"window.scrollTo(0, document.querySelector('{s[2]}').getBoundingClientRect().top + window.scrollY)")
        else: await pg.evaluate(f'window.scrollTo(0, {int(s[1]*vh)})')
        await pg.wait_for_timeout(2200)
        await pg.screenshot(path=f'{OUT}/{name}-{s[0]}.png')
    # interaction: open search, submit empty, fill, submit
    await pg.evaluate('window.scrollTo(0,0)'); await pg.wait_for_timeout(1500)
    await pg.click('.search-pill'); await pg.wait_for_timeout(600)
    await pg.click('.search-go--submit', force=True); await pg.wait_for_timeout(300)
    await pg.screenshot(path=f'{OUT}/{name}-10-search-validation.png')
    await pg.fill('input[type=date]', '1990-03-12'); await pg.fill('input[type=time]', '06:30'); await pg.fill('input[autocomplete="address-level2"]', 'Pune, India')
    await pg.click('.chip >> nth=1', force=True); await pg.click('.search-go--submit', force=True); await pg.wait_for_timeout(700)
    await pg.screenshot(path=f'{OUT}/{name}-11-search-ready.png')
    print(name, 'ERRORS:' if errs else 'no console errors', *errs[:20], sep='\n  ')
    await b.close()
async def main():
    async with async_playwright() as p:
        await run(p, 'desktop', {'width': 1440, 'height': 900}, False)
        if os.environ.get('DESKTOP_ONLY'): return
        await run(p, 'mobile', {'width': 390, 'height': 844}, True)
asyncio.run(main())

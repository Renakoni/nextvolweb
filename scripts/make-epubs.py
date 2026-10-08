from pathlib import Path
from zipfile import ZipFile, ZIP_STORED, ZIP_DEFLATED
import re

root = Path('evidence/product/fixture')
source = Path('scripts/research-fixture.mjs').read_text(encoding='utf-8')
paragraphs = re.findall(r"^  '(.*?)',$", source, re.M)
titles = ['风经过的地方', '夜航信笺', '夏日慢行', '山海来信']
chapters = ['风来的清晨', '沿着海岸线', '下一站晴天']
for i, title in enumerate(titles):
    with ZipFile(root / f'nextvol-{i}.epub', 'w') as epub:
        epub.writestr('mimetype', 'application/epub+zip', compress_type=ZIP_STORED)
        epub.writestr('META-INF/container.xml', '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>')
        manifest = '<item id="cover" href="cover.png" media-type="image/png"/><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>'
        manifest += ''.join(f'<item id="c{n}" href="c{n}.xhtml" media-type="application/xhtml+xml"/>' for n in range(3))
        spine = ''.join(f'<itemref idref="c{n}"/>' for n in range(3))
        epub.writestr('OEBPS/content.opf', f'<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" unique-identifier="id" version="2.0"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>{title}</dc:title><dc:creator>NextVol</dc:creator><dc:language>zh-CN</dc:language><dc:identifier id="id">nextvol-original-{i}</dc:identifier><meta name="cover" content="cover"/></metadata><manifest>{manifest}</manifest><spine toc="ncx">{spine}</spine></package>')
        points = ''.join(f'<navPoint id="n{n}" playOrder="{n+1}"><navLabel><text>{t}</text></navLabel><content src="c{n}.xhtml"/></navPoint>' for n,t in enumerate(chapters))
        epub.writestr('OEBPS/toc.ncx', f'<?xml version="1.0"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head/><docTitle><text>{title}</text></docTitle><navMap>{points}</navMap></ncx>')
        epub.write(root / f'cover-{i}.png', 'OEBPS/cover.png', compress_type=ZIP_DEFLATED)
        for n,t in enumerate(chapters):
            text = ''.join(f'<p>{p}</p>' for p in paragraphs)
            epub.writestr(f'OEBPS/c{n}.xhtml', f'<?xml version="1.0" encoding="utf-8"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>{t}</title></head><body><h1>第{["一","二","三"][n]}章 {t}</h1>{text}</body></html>')
print('Created four original EPUBs with original covers and three chapters each.')

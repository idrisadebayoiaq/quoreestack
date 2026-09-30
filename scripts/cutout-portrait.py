"""Cut the hero portrait out of its background and trim it to the subject.

Usage: python scripts/cutout-portrait.py public/images/quoreeb-adebayo.png public/images/quoreeb-cutout.png
Requires: pip install "rembg[cpu]" pillow
"""

import sys

from PIL import Image
from rembg import new_session, remove

source, target = sys.argv[1], sys.argv[2]
image = Image.open(source).convert("RGB")

cut = remove(image, session=new_session("isnet-general-use"), post_process_mask=True)

left, top, right, bottom = cut.getchannel("A").point(lambda a: 255 if a > 24 else 0).getbbox()
pad = int(max(right - left, bottom - top) * 0.04)
box = (max(left - pad, 0), max(top - pad, 0), min(right + pad, cut.width), cut.height)
cut.crop(box).save(target, optimize=True)
print(target, cut.crop(box).size, "crop box", box)

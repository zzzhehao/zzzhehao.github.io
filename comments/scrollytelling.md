---
title: "Scrollytelling"
author: "Zhehao Hu"
---

I began looking into this after being inspired by [Andrew Bray](https://github.com/andrewpbray) and tried out [closeread](https://github.com/qmd-lab/closeread). Its a quite innovative method in story-telling and I think it can be more effectively locking audience's attention. 

However, since closeread is currently (2024/09/05, ver 0.7.0) is still in earch developing, it's still quite a mess. Several things I encountered on my first day trying this:

1. You can't use image caption, otherwise the image will be rendered as a quarto object, the closeread formatting will no longer apply to them.

2. There's a very weired compatibility issue with Quarto file structure, I am not 100% sure for the cause, but I noticed if I put a qmd file using closeread custom html as output format under a folder, which was already existing before the extension was installed, it will produce an error while previewing or rendering, saying that the renaming event is failed because the path is not found (the origin or the destination? IDK). If manually, we can try a second attempt without any modification and it will work, but when rendering the whole site, this error kills the process. But all things will work out if you put the file under a new folder, or directly under the root folder.

    I am not reporting this, because I still can't really reproduce the issue with another minimal Quarto project, which means there might be another issue source in my website that I haven't identified. 🤷‍♂️
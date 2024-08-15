---
title: "Comment"
author: "Zhehao Hu"
---
This file is not meant to be included in the website, if it renders weirdly, try open it on GitHub.

This comment notes some things not widely mentioned on the internet and can be confusing for beginners while trying to construct the website.

### 2024/07/14 

1. Quarto is sensitive to tabs, especially when dealing with html. If seeing html code printed out in the preview, try delete tabs in the line. Sometimes three tabs can already cause difference.

2. Quarto may need some other effort to let JS be called in .qmd using html `<script>` and operate. 
    - see [here](https://github.com/quarto-dev/quarto-cli/discussions/4179) and maybe also [here](https://forum.posit.co/t/quarto-equivalent-to-exclude-yaml-command-in-distill/148758).

3. An example may involving batch construct [here](https://b.bapt.xyz/posts/gallery/#generating-the-page-with-quarto)

4. A brilliant show case of automatically extracting photo exif and showing them while inspecting photo, can maybe used otherwise, [example](https://rfsaldanha.github.io/photos/photos.html) and [source code](https://github.com/rfsaldanha/rfsaldanha.github.io/blob/main/photos/photos.qmd) 

5. Also see [lightbox tool](https://github.com/quarto-ext/lightbox?tab=readme-ov-file)

6. **Design**: [hamada hideaki](https://github.com/quarto-ext/lightbox?tab=readme-ov-file) 

### 2024/07/19 Apply Javascript

- Quarto treats Javascript differently (although I don't know Javascript at all but certainly it is a bit more complex than in pure html), use following front matter yaml header to include the script:

    ```yaml
    include-after-body: 
    - text: |
        <script src="gallery.js"></script>
    ```

- I asked [Perplexity](https://perplexity.ai) a lot while constructing my site, I really have no idea in front end development, but I do recommend Perplexity for coding and information searching -- it is really powerful.

### 2024/07/22 !important: Assets management

- For everyone have assets in their webstie, spend some time reading [Quarto documentation](https://quarto.org/docs/websites/website-tools.html#site-resources).

- I was confused as hell today as every time I run `$ quarto render` it just delete every image I stored under `_site/`, then I realized that the way I managed the assets must not have been legitimate. So even though this took me whole night to figure out but it certainly prevented a huge mess up in the foreseeable future.

- Briefly, put all assets file outside the output file and manage as you want, but specify them in `_quarto.yml` using 'resource' option, incase you somehow not direclty linked them (e.g. my gallery's full-screen view calls images via JavaScript). Everything under 'resource' option will be forcibly exported by quarto in its output and could be used normally by html files. I think this should be the most reasonable way that won't mess up in the future.

- Honestly, I rolled back like 5 times this evening to find this out.

### 2024/07/23 HTML custom footer

- AI can't 100% take over to build your site for you. I struggled since a few days with the footer, the main problem was:

    - Quarto has its own footer options in `_quarto.yml`: `page-footer`, `body-footer` or `margin-footer`, but they are all website-wide, and it can't be turned off locally (`page-footer: false` yaml header somehow does not work, I don't know if it is a bug or intended). As you see, it is not optimal for me since I have several highly customized pages (index, gallery)

    - The alternative is to build the footer directly with html. But if you want to keep the project tidy and clean, the best way is to create the footer separately in one file and assign it via `_metadata.yml`, otherwise it will be a catastrophe if I want to change the footer across website in a later point. And this, my friend, is a horrible quest for someone who has no idea about html, because you can encounter numerous strange problems like footer completely destroy quarto's default layout or forcibly expanding page height and show unnessary scroller, etc. But I found [this](https://albert-rapp.de/posts/13_quarto_blog_writing_guide/13_quarto_blog_writing_guide#add-a-footer-below-blog-posts) and modified upon it. I totally love it. Now I can put anything I want in the footer and even make variations of it.

- [SCSS Variable List](https://github.com/twbs/bootstrap/blob/main/scss/_variables.scss)

### 2024/07/27 Custom Background

- Customizing background with image is quite easy in pure HTML/CSS, but in quarto it might be messy if TOC is enabled. Direclty use `body {background-image}` will let TOC stuck at highlighting the last element regardless where you are.

- To bypass this it needs to define another class, and use it inside the .qmd body. To avoid a two-step workflow, I no longer use css to achieve custom background but use HTML file specifying css. So the step is create a html file:

    ```html
    <style>
        .background-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('image.jpg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-attachment: fixed;
        z-index: -2;
        }

        /* If you want to mute the background a bit */
        .background-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(39, 45, 50, 0.6);
        z-index: -1;
        }
    </style>

    <!-- You need to call the section to finally insert image.
    When calling upper part using CSS, you will need to manually insert the part below in MD body. -->
    <div class="background-container"></div>
    <div class="background-overlay"></div>
    ```

- Call this html file in yaml header via:

    ```yaml
    format:
    html:
        include-in-header: bg.html
    ```

- The idea is to bypass the utilization of body section which is used by quarto. (Omg I'm actually starting to understand HTML and CSS)

- See next point. ~~Since the image url is relative, it will not work if the .qmd file is at different level. If the background is not widely used across the website, the path can be corrected by inserting following right after yml header (oh dear I really understand HTML and CSS now)~~

    ```html
    <div class="background-container"; style="background-image: url('corrected/image.jpg');"></div>
    ```

- I ran into the same problem when I try to apply footer.html to files at different level, then I realize this must not be legitimate. I did some searching and it turns out it's a common knowledge in front-end developing that `/` directly uses the project root. So just put following in `_quarto.yml` and then use absolute path in html (but not in yaml, there you still need to define the relative path) 

    ```yaml
    project:
      execute-dir: project
    ```
    
### 2024/07/28 404 page and project path

- Following up last point, I ran into an even weirder situation while designing 404 page (type whatever under my site to see it). I wanted to use custom background but the problem is 404 page could be rendered everywhere at any depth as the user ran into invalid address. Which means the image I use is at different relative location to the rendered 404 page.
- I found [this discussion](https://github.com/quarto-dev/quarto-cli/issues/5284#issuecomment-1533526078) and one of the developer stated that we can use project path (same as the one mentioned in the last point) in yaml header, but it seems not be a simple `/` but rather a `./`, but I am not hundred percent sure. 
- I also found [this issue](https://github.com/quarto-dev/quarto-cli/issues/3788) and it further confused me plus it's been labeled as a future feature that has been delayed twice, so I gave up with this.
- Weird thing is, I somehow couldn't use project path within the html, so I ended up with a JS script that can generate a relative path. For now I embeded it in the `theme/bg-red-plane-2.html` since I don't need it anywhere else so I don't want to touch it. If you also have similar problem, maybe check it out.

<!-- ### 2024/08/13 Avoid using absolute path from system root - setup crontab to sync files

- I was still struggling with file path in quarto. I recently rearranged my zotero files and I now save the main library structure at local but use zotfile and betterbix to store the assets in iCloud so I can access from different location.
- The things is, my quarto project, including the one I use for research writing, are both local. I tried many ways but couldn't let pandoc recognize the .bib file I stored in iCloud. (I tried relative path, environment variables both in _environment or in /.zshrc)
- So I came up with the solution that I will store the bib file local, and let cron (a tool built in the Unix/Linux system) to sync that file to icloud automatically. 
- The setup:
    - `$ crontab -e` to open editor (probably in terminal)
    
    ```bash
    */30 * * * * cp /path/to/source/file /path/to/destination/ >> /path/to/log/file 2>&1
    ```

    to setup, where `*/30 * * * *` means excute every 30 minutes.
    - If you are using default editor (vim) like me, hit esc, type `:wq`, hit enter, then it should show `crontab: installing new crontab`.
    - `$ crontab -l` to see if it is installed correctly. -->
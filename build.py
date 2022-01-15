from genericpath import exists
import os
import sys
import json
import pathlib
import shutil


def generate_for_entry(deploy_path, uid, entry):
    import string

    html = []

    # INTRO
    intro = string.Template("""
        <div id="botName">$name</div>
        <div id="botAuthor">by <a href="$author_site">$author_name</a> on $upload_date</div>

        <div id="botDescription">$description</div>
    """).safe_substitute(**entry)
    html.append(intro)

    # TAGS
    html.append(""" <div class="card_bot_tags_bot"><b>tags: </b>""")
    tag = string.Template("""   <div class="card_bot_tag">$programming_language</div>""").safe_substitute(**entry)
    html.append(tag)
    for tag in entry.get('tags'):
        tag = string.Template("""   <div class="card_bot_tag">$tag</div>""").safe_substitute(tag=tag)
        html.append(tag)
    html.append(""" </div>""")

    # GH repo card
    if entry.get("repository_url", ""):
        org = entry.get("repository_url", "").split("/")[-2]
        entry["org"] = org
        gh = string.Template(
    """
        <div class="div_git_repo">
        <b>Repository:</b><br/>
            <a href="$repository_url">
            <img align="center" src="https://github-readme-stats.vercel.app/api/pin/?username=$org&repo=$repository_name"/>
            </a><br/>
        <font style='font-size:12px'>* Source code may be subject to copyright, check with author for redistribution.</font>
        </div>
    """
        ).safe_substitute(**entry)
        html.append(gh)

    # YouTube Video
    if entry.get("youtube_video"):
        entry["hp"] = entry.get("youtube_height")/entry.get("youtube_width")*100
        youtube = string.Template(
    """
        <div class="video-container" style="padding-bottom:$hp%">
            <iframe class="youtube_embeded" width="" height="" src="$youtube_video" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    """
        ).safe_substitute(**entry)
        html.append(youtube)

    entry["url"] = f"https://repository.botcity.dev/bot-{uid}.html"
    upload_date_iso = "/".join(entry.get("upload_date").split("/")[::-1])
    entry["upload_date_iso"] = upload_date_iso

    page = """
    <html xmlns:og="http://opengraphprotocol.org/schema/" >
    <head>
        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-N4HVP5D');</script>
        <!-- End Google Tag Manager -->
        <meta charset="UTF-8">
        <link rel="stylesheet" href="./css/main.css">
        <link rel="stylesheet" href="./css/bot.css">
        <title>BotRepository - $name</title>

        <!--  Essential META Tags -->
        <meta property="og:type" content="article" />
        <meta property="og:title" content="BotRepository - $name" />
        <meta property="og:site_name" content="BotRepository" />
        <meta property="og:url" content="$url" />
        <meta property="og:image" content="$thumbnail_url" />
        <meta property="og:description" content="$description" />
        <meta property="article:author" content="$author_name" />
        <meta property="article:published_time" content="$upload_date_iso" />

        <meta property="og:locale" content="en_US"/>

        <!--  Non-Essential, But Required for Analytics -->
        <meta name="twitter:site" content="@BotcityDev" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image:alt" content="$name" />


    </head>

    <body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N4HVP5D"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->

    <!-- HEADER -->
    <div data-include="header"></div>

    <!-- Main Content -->
    <div id="botPanel">$content</div>

    <!-- FOOTER -->
    <div data-include="footer"></div>

    <script src="./js/jquery-3.6.0.min.js"></script>
    <script src="./js/ui.js"></script>

    <script>

    $(function () {
        UI.load();
    });

    </script>

    </body>
    </html>
    """

    page_code = string.Template(page).safe_substitute(content="\n".join(html), **entry)

    output_file = os.path.join(deploy_path, f"bot-{uid}.html")
    with open(output_file, "w") as f:
        f.write(page_code)


def build():
    OUTPUT_FOLDER = "site-deploy"

    base_path = os.path.dirname(os.path.realpath(__file__))
    base_site = os.path.join(base_path, "site")
    json_file = os.path.join(base_site, "data", "records.json")
    deploy_path = os.path.join(base_path, OUTPUT_FOLDER)
    if not os.path.exists(json_file) or not os.path.isfile(json_file):
        sys.exit("Could not find site/data/records.json file.")

    print("Base Path: ", base_path)
    print("Base Site: ", base_site)
    print("JSON File: ", json_file)
    print("Deploy Path: ", deploy_path)

    shutil.rmtree(deploy_path, ignore_errors=True)
    shutil.copytree(base_site, deploy_path)

    with open(json_file, "r") as f:
        database = json.loads(f.read())

    for uid, entry in enumerate(database):
        generate_for_entry(deploy_path, uid, entry)

    print(f"All set. Your new site is available at: {deploy_path}")

build()
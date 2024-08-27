purrr::walk(fs::dir_ls("functions/", glob = "*.R"), source)

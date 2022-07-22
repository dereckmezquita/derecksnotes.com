# derecksnotes.com

DerecksNotes v2.0.

# Infrastructure

A `no-sql` type database might be better suited for my needs; no strict schemas to define and allows for flexbility with scaling/data structures.

## Database

- Database
    - table1: articles
        - entry_id
        - website_page
        - author
        - cover_image
        - date
        - display_name
        - display_slogan
        - display_summary
        - catrgories/tags
        - publish_status
        - likes
        - comments - this should be a separate table
    - table2: user_accounts
        - username
        - password
        - email
        - date_created
        - date_last_login
    - table3: comments

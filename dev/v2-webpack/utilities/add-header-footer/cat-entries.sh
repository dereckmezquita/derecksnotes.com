
top=$'<!DOCTYPE html>
<html lang="en-uk">

<head>
    <title>
        Dereck\'s Notes
    </title>
    <meta name="description"
        content="The online brain of Dereck de Mezquita; making sciencing easier.">
    <meta name="keywords"
        content="Science, Programming, Bioinformatics, Biology, Technology, Education, Art, Dictionary, Blog">

    <%- include ../templates/includes/head.ejs %>
</head>

<body>
    <%- include ../templates/includes/info-bar.ejs %>
    <%- include ../templates/includes/header.ejs %>

    <%- include ../templates/includes/nav.ejs %>

    <div class="content-wrapper">
        <%- include ../templates/includes/side-bar.ejs %>

        <article>
'

bottom=$'
        </article>
    </div>

    <%- include ../templates/includes/footer.ejs %>
</body>

</html>'

for file in $(ls ./entries/*html); do
    echo $file
    new_file=$(echo $file | sed 's/\.html/\.ejs/g')
    echo -e "$top" > outputs/$(basename $new_file)
    cat $file >> outputs/$(basename $new_file)
    echo -e "$bottom" >> outputs/$(basename $new_file)
done

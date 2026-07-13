# AIC GALLERY

I loved how AICs Website Gallery looks. Equal columns, image is at native ratio, no empty space. Layout is not chaotic, but at the same time not overly linear. Very elegant.

Turns out you can't do that with css, so I wrote a small js script that achieves this behaviour.
Gallery is primarily for organizing actual elements, CSS is on you.

*example with custom css*
![gallery_showcase_css](img/gallery_showcase_css.png)
*how raw gallery looks*
![gallery_showcase_raw](img/gallery_showcase_raw.png)

## What do you need?

* A div with unique id that will contain the gallery
* An array of whatever you want to output
* Height and Width in px for **every** image in array
* Manually link the aic_gallery.css file

## USAGE
Gallery is initialized using `gallery_init()` function. There are some arguments:
```
gallery_init(array, container_id, cols, template, load_delay);

array: your array with items
container_id: id of a container where the gallery will be contained
cols: amount of columns you want to have (3-4 is good)
template: string of HTML elements for a single entry

load_delay[OPTIONAL]: it can look cool! (set in milliseconds)
```

### Initialization Examples:

**You MUST add data-width and data-height as INT to \<img\> tag, see below in example**

*Note, AIC website itself uses pre-calculated img dimensions, so all fair*

This gallery would:
* take in an associative PHP array, 
* bind to a container with id "gallery_container"
* have 3 columns
* output a specific DOM structure for each element. 

```
<link rel='stylesheet' href="/css/aic_gallery.css">

<script src="/libs/aic_gallery.js"></script>

<script>
const arr = <?php echo json_encode($image_array) ?>;
const container_id = "gallery_container";
const cols = 3;

gallery_init(arr, container_id, cols, function(entry){
    return `
        <div class="entry_container">
            <img 
            src="${entry.image_path}" 
            data-width=${entry.width}
            data-height=${entry.height}
            >

            <span class="entry_title"><b>${entry.image_title}</b></span>
            <span class="entry_date">${entry.image_date}</span>
        </div>`
;});
</script>

<div id="gallery_container" class="gallery_container"></div>
</div>

```
Simpler example with just an image and a cosmetic 250ms delay:
```

<link rel='stylesheet' href="/css/aic_gallery.css">

<script src="/libs/aic_gallery.js"></script>

<script>
const arr = [["/path/to/img1", 480, 280],["/path/to/img2", 1080, 2042]];
const container_id = "some_other_container";
const cols = 3;

gallery_init(arr, container_id, cols, function(entry){
    return 
        `<img 
        src="${entry[0]}" 
        data-width=${entry[1]}
        data-height=${entry[2]}
        >`
    ;}, 250);
</script>

<div id="some_other_container" class="gallery_container"></div>
</div>

```

## CSS and function(entry)
As you can see, you can enter anything into return as a string, and that will be the structure for every item in the gallery. This means that all you have to do to change CSS is create your own wrappers and rules for them. For example, in init function #1, "entry_container" is a custom class with its own css rules. Want a description for image? Add a div, add a variable, write css rule, and that is it. 

Your entry must have a div that wraps the entire item, and **all horizontal margins/padding/borders should only be applied to that div**. Gallery does make one for its own purposes, but it calculates margins only for 1st child, which would be your wrapper div. If you apply horizontal shift to internal elements, it will break the layout.

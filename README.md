
# AIC GALLERY

I loved how AICs Website Gallery looks. Equal columns, image is at native ratio, no empty space. Layout is not chaotic, but at the same time not overly linear. Very elegant.

Turns out you can't do that with vanilla css, so I wrote a small JS script that achieves this behaviour.
Gallery is primarily for organizing actual elements, CSS is on you.

*example with custom css*
![gallery_showcase_css](img/gallery_showcase_css.png)
*how raw gallery looks*
![gallery_showcase_raw](img/gallery_showcase_raw.png)
*Also check it out at [dovskyi.org/gallery](https://dovskyi.org/src/gallery.php)!*

### What do you need?

* A div with unique ID that will contain the gallery
* Array of images and/or misc data
* Height and Width for every image if used, in px

**gallery supports multiple instances per page and block rearrangement**

## USAGE
Gallery is initialized using `gallery_init()` function. There are some arguments:
```
gallery_init(array, container_id, cols, template, load_delay);
```
1. array: your array with items.
2. container_id: id of a container where the gallery will be contained.
3. cols: amount of columns you want to have (3-4 is good).
4. template: string of HTML elements for a single entry.
5. load_delay [OPTIONAL]: it can look cool! (set in milliseconds).

### Rearrange blocks function:
Blocks can be rearranged in the same container to a different number of columns. Note, that new number of columns can only be smaller or equal to number of columns in initialization. So if you set cols=3 in gallery_init(), you can only rearrange to 1-3 columns. If you want to rearrange to a greater number as a workaround, you can first initialize it to that number & then rearrange to your desired smaller number.

Usage for rearrange function:
```
aic_rearrange(new cols, container_id);

new cols: new number of columns. Must be <= than columns in initialization
container_id: string name of the gallery you want to rearrange
```

This was added for my own usecase, so I am sorry about not being able to rearrange to more columns--i don't need that capability.

### Step 1: Add CSS and JS files
```
<link rel='stylesheet' href="/path/to/aic_gallery.css">
<script src="/path/to/aic_gallery.js"></script>
```
### Step 2: Add container div
```
<div id="whatever_id" class="whatever_class"></div>
</div>
```
### Step 3: Run init function
```
<script>
const arr = <?php echo json_encode($image_array) ?>;
const container_id = "whatever_id";
const cols = 3;

gallery_init(arr, container_id, cols, function(entry){
return 
`
	<div class="entry_container">
	  <img 
	  src="${entry.image_path}" 
	  data-width=${entry.width}
	  data-height=${entry.height}
	  >
	  <span class="entry_title"><b>${entry.image_title}</b></span>
	  <span class="entry_date">${entry.image_date}</span>
	</div>
`
;});
</script>
```
## Required Syntax & limitations
* \<img\> element **must** have data-width and data-height as INT.
* Entry must have some sort of item wrapper div, e.g.:
```
<div class="required_wrapper">
	//whatever you need for single item
</div>
```
* **Only item wrapper can have horizontal margins/padding/borders**. Vertical is fine for any internal element. If you want distance between columns, add margins to the item wrapper. There is usually no need to edit library css, unless you are doing something very specific.

### Initialization Examples:
Full example from above
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
const delay_ms = 250;

gallery_init(arr, container_id, cols, function(entry){
    return 
        `<img 
        src="${entry[0]}" 
        data-width=${entry[1]}
        data-height=${entry[2]}
        >`
    ;}, delay_ms);
</script>

<div id="some_other_container" class="gallery_container"></div>
</div>

```

## CSS and function(entry)
As you can see, you can enter anything into return as a string, and that will be the structure for every item in the gallery. This means that all you have to do to change CSS is create your own wrappers and rules for them. For example, in init function #1, "entry_container" is a custom class with its own css rules. Want a description for image? Add a div, add a variable, write a css rule, and that is it. 

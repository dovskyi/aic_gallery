# AIC GALLERY

I loved how Art Institute of Chicago website gallery layout looks. Equal columns, image is always at native ratio, no empty space. Starts in a neat grid, but slowly deteriorates into chaos. So pretty. 

Turns out you can't do that with css, so I wrote a small js script that achieves this behaviour.

![gallery_showcase_css](img/css_example.png)
![gallery_showcase_raw](img/raw_example.png)

 ## What can it do?
 
* Read an array, e.g. whatever php spits out
* Assign any template for an item, it doesn't have to be a single \<img\>
* Maintain a neat vertical gap between columns - one column will never be *much* taller than other ones
* You can have multiple on the same page, IDs are unique

## What do you need?

* A container div with unique id (where gallery will live)
* An array of whatever you want to output
* Path to where you saved aic_gallery css file

## USAGE
Gallery is initialized using `gallery_init()` function. There are some required arguments:
```
gallery_init(array, container_id, cols, path, template, load_delay);

array: your array with items
container_id: id of a container where the gallery will be contained
cols: amount of columns you want to have (3-4 is good)
path: path to aic_gallery.css file that you saved
template: how will an item look?

load_delay[OPTIONAL]: each image waits 50ms to load by default. I found that raising this to ~250ms creates a nice appearing sequence, almost as if it was intended. If you want default, just do not enter the last argument, or put "undefined"
```

### Initialization Examples:
This gallery would take in an associative PHP array, bind to a container with id "gallery_container", have 3 columns, reference a css file at that path, and output a specific DOM structure for each element. **All you need to change the structure is just replace the return string.**
```
<script src="/libs/aic_gallery.js"></script>
<script>
const array = <?php echo json_encode($image_array) ?>;
const container_id = "gallery_container";
const cols = 3;
const path = '/css/aic_gallery.css';

gallery_init(array, container_id, cols, path, function(entry){
									return 
									`<div class="entry_container">
											<img src="${entry.image_path}">
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
<script src="/libs/aic_gallery.js"></script>
<script>
const array = ["/path/to/img1", "/path/to/img2", "/path/to/img3];
const container_id = "some_other_container";
const cols = 3;
const path = '/css/aic_gallery.css';

gallery_init(array, container_id, cols, path, function(entry){
									return 
											`<img src="${entry.image_path}">`
									;}, 250);
</script>

<div id="some_other_container" class="gallery_container"></div>
</div>

```

## CSS
Since you can input any DOM template, you can just add your own css to an item. Changing css for internal components (e.g. columns) is easy too, just look inside aic_gallery.css file. Some elements are appended as a string in .js file, so if you wish you can modify that string.

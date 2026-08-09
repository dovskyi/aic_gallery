/*
 * Author: dovskyi
 * 2026-07-12
 * GPL-3.0 license
 */
let _gallID = 0; //global gallery ID
var _instances = []; //data for all galleries on page
const _delay = ms => new Promise(res => setTimeout(res, ms));

function _smallestInArray(arr_col, col) {
        let a = Number.MAX_SAFE_INTEGER;
        let indx = 0;
        for (let i=0; i<col; i++){
                let h = arr_col[i].offsetHeight;
                if (a > h) {
                        a = h;
                        indx = i;
                }
        }
        return indx;
}

function _get_margins(block) {
        //here block is user's entry container, not class wrapper
        let spacing = 0;
        let style = window.getComputedStyle(block);
        spacing  = (parseFloat(style.marginLeft) || 0) +
                (parseFloat(style.marginRight) || 0) +
                (parseFloat(style.paddingLeft) || 0) +
                (parseFloat(style.paddingRight) || 0) +
                (parseFloat(style.borderLeftWidth) || 0) +
                (parseFloat(style.borderRightWidth) || 0);

        return spacing;
}


function gallery_init(arr, gallery_container, col, template, load_delay){

        const timeout = (load_delay === undefined)? false: true;

        window.addEventListener('DOMContentLoaded', async function(event) {
                const gallery_wrapper = document.getElementById(gallery_container); //user's container for gallery
                _gallID++;
                //add instance to global array
                _instances[gallery_container] = {arr_col: [],
                                                blocks: []};

                let arr_col = _instances[gallery_container].arr_col;

                if (col < 1) {
                        window.alert("Gallery columns can't be <1");
                }
                gallery_wrapper.insertAdjacentHTML("beforeend", `<div id='gallery_cont${_gallID}' class='gallery_cont'></div>`);
                gallery_wrapper.insertAdjacentHTML("beforeend", `<div id='temp_holder${_gallID}' style='visibility: hidden; position:absolute;'></div>`);
                const temp = document.getElementById(`temp_holder${_gallID}`);
                const container = document.getElementById(`gallery_cont${_gallID}`);

                for (let i=0; i<col; i++) {
                        //partition the container into n columns, write columns into array
                        let col = `<div id="col_${i}${_gallID}" class="gallery_col"><div id="wrapper_col_${i}${_gallID}"></div></div>`;
                        container.insertAdjacentHTML("beforeend", col);
                        arr_col.push(document.getElementById(`wrapper_col_${i}${_gallID}`));
                }

                if (arr.length < 1) {
                        temp.remove();
                        return;
                }

                const col_width = arr_col[0].offsetWidth;

                for (let i=0; i<arr.length; i++){
                        //create temporary invisible div, fill with blocks from strings
                        let entry = `<div class="block">` + template(arr[i]) + `</div>`;
                        temp.insertAdjacentHTML("beforeend", entry);
                }
                //now that we have all blocks as objects, write them into array
                //(has to be a static array, because children method itself
                //actually returns an HTMLCollection)
                _instances[gallery_container].blocks = Array.from(temp.children);
                let blocks = _instances[gallery_container].blocks;

                let margin_spacing = _get_margins(blocks[0].firstElementChild);
                let scale_width = col_width - margin_spacing;

                for (const block of blocks) {
                        //create parent div for image
                        const img = block.querySelector("img");
                        if (img) {
                                const img_wrap = document.createElement("div");

                                img.before(img_wrap);
                                img_wrap.appendChild(img);

                                const img_width = img.dataset.width;
                                const img_height = img.dataset.height;

                                const r = img_width/img_height;
                                //force wrapper div into img dimensions
                                img_wrap.style.display = "block";
                                img_wrap.style.width = scale_width + "px";
                                img_wrap.style.height = scale_width/r + "px";
                        }

                        //append block to shortest column
                        //appendChild removes duplicates automatically
                        const curr_index = _smallestInArray(arr_col, col);
                        arr_col[curr_index].appendChild(block);

                        if (timeout) {
                                //cosmetic delay if user wants
                                await _delay(load_delay);
                        }
                }
                temp.remove();
        });
}

function aic_rearrange(col, gallery_container){
        const arr_col = _instances[gallery_container].arr_col;
        const blocks = _instances[gallery_container].blocks;

        const maxCols = arr_col.length;
        const container = document.getElementById(gallery_container);

        if (cols > maxCols || cols < 1) {
                window.alert("Rearrangement can't be smaller than 1 OR greater than initialization columns");
                return;
        }

        //manually set current height so view doesn't jump when all blocks are removed
        container.style.minHeight = container.scrollHeight + "px";

        //remove all blocks from container
        for (const block of blocks) {
                block.remove();
        }

        //toggle visibility for columns
        for (let i=0; i<col; i++) {
                arr_col[i].parentNode.style.display = '';
        }
        for (let i=maxCols; i>col; i--) {
                arr_col[i-1].parentNode.style.display = 'none';
        }

        //reappend blocks to visible columns
        for (const block of blocks) {
                const curr_index = _smallestInArray(arr_col, col);
                arr_col[curr_index].appendChild(block);
        }

        //remove manual height
        container.style.minHeight = '';
}

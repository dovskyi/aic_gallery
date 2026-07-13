/*
 * Author: dovskyi
 * 2026-07-12
 * GPL-3.0 license
 */

let _gallID = 0; //global gallery ID for every instance
const _delay = ms => new Promise(res => setTimeout(res, ms));

function _smallestInArray(arr_col) {
        let a = Number.MAX_SAFE_INTEGER;
        let indx = 0;
        for (let i=0; i<arr_col.length; i++){
                let h = arr_col[i].scrollHeight;
                if (a > h) {
                        a = h;
                        indx = i;
                }
        }
        return indx;
}

function _get_margins(block) {
        //here block is user's entry container
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

function gallery_init(arr, gallery_container, cols, template, load_delay){

        const timeout = (load_delay === undefined)? false: true;

        window.addEventListener('load', async function(event) {
                const gallery_wrapper = document.getElementById("gallery_container"); //user's container for gallery
                _gallID++;

                if (cols < 1) {
                        window.alert("Gallery columns can't be <1");
                }
                if (arr.length < 1) {
                        return;
                }
                gallery_wrapper.insertAdjacentHTML("beforeend", `<div id='gallery_cont${_gallID}' class='gallery_cont'></div>`);
                gallery_wrapper.insertAdjacentHTML("beforeend", `<div id='temp_holder${_gallID}' style='visibility: hidden; position:absolute;'></div>`);
                const temp = document.getElementById(`temp_holder${_gallID}`);
                const container = document.getElementById(`gallery_cont${_gallID}`);


                let arr_col = [];

                for (let i=0; i<cols; i++) {
                        //partition the container into n columns, write columns into array
                        let col = `<div id="col_${i}${_gallID}" class="gallery_col"><div id="wrapper_col_${i}${_gallID}"></div></div>`;
                        container.insertAdjacentHTML("beforeend", col);
                        arr_col.push(document.getElementById(`wrapper_col_${i}${_gallID}`));
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
                let blocks = Array.from(temp.children);
                let margin_spacing = _get_margins(blocks[0].firstElementChild);
                let scale_width = col_width - margin_spacing;

                for (const block of blocks) {
                        //create parent div for image
                        const img = block.querySelector("img");
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

                        //append block to shortest column
                        //appendChild removes duplicates automatically
                        const curr_index = _smallestInArray(arr_col);
                        arr_col[curr_index].appendChild(block);

                        if (timeout) {
                                //cosmetic delay if user wants
                                await _delay(load_delay);
                        }
                }
                temp.remove();
        });
}

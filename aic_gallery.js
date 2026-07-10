/*
 * Author: dovskyi
 * 2026-07-09
 * GPL-3.0 license
 */

let _gallID = 0;
let _min = [0,0];
let _max = [0,0];
const _delay = ms => new Promise(res => setTimeout(res, ms));
// Source for picture await - https://stackoverflow.com/q/263359
var isPhotoLoaded = false;
function photoLoaded()
{
        isPhotoLoaded = true;
}

function get_max(arr){
        let a = 0;
        let j = 0;
        for (let i=0; i<arr.length; i++){
                if (a < arr[i]) {
                        a = arr[i];
                        j = i;
                }
        }
        _max = [j, a];
        return;
}

function get_min(arr){
        let a = Number.MAX_SAFE_INTEGER;
        let j = 0;
        for (let i=0; i<arr.length; i++){
                if (a > arr[i]) {
                        a = arr[i];
                        j = i;
                }
        }
        _min = [j, a];
        return;
}

function gallery_init(arr, gallery_container, cols, css_file_path, template, load_delay /*optional*/){
        let timeout = (load_delay === undefined)? 50: load_delay;
        window.addEventListener('load', async function(event) {
                _gallID++;
                if (cols < 1) {
                        window.alert("Gallery columns can't be <1");
                }
                if (_gallID <= 1) {
                        //add stylesheet if 1st gallery on page
                        document.head.insertAdjacentHTML("beforeend", `<link rel='stylesheet' href='${css_file_path}'>`);
                }
                document.getElementById(gallery_container).insertAdjacentHTML("beforeend", `<div id='gallery_cont${_gallID}' class='gallery_cont'></div>`);
                const container = document.getElementById(`gallery_cont${_gallID}`);

                let arr_col = [];
                let height = Array(cols).fill(0);
                let cnt = 0;
                let indx = 0;

                for (let i=0; i<cols; i++) {
                        //partitions the container into n columns, writes columns into array
                        let col = `<div id="col_${i}${_gallID}" class="gallery_col"><div id="wrapper_col_${i}${_gallID}"></div></div>`;
                        container.insertAdjacentHTML("beforeend", col);
                        arr_col.push(document.getElementById(`wrapper_col_${i}${_gallID}`));
                }
                for (let i=0; i<arr.length; i++){
                        //creates entry based on template, adds onload attribute to <img>
                        let entry = template(arr[i]);
                        entry = entry.replace(/(<img\b)/gi, '$1 onload="photoLoaded();"');

                        //if height difference between shortest and tallest column too big, skip and insert into shortest column
                        //feel free to change 500 to whatever
                        let indx = ((_max[1]-_min[1]) > 500)? _min[0]: (cnt%cols);

                        arr_col[indx].insertAdjacentHTML("beforeend", entry);

                        while (!isPhotoLoaded) {
                                //if no wait, .scrollHeight returns 0 if img is not cached
                                await _delay(timeout);
                        }
                        isPhotoLoaded = false;
                        height[indx] = arr_col[indx].scrollHeight;
                        cnt++;
                        get_max(height);
                        get_min(height);
                }
        });
}

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
var isPhotoLoaded = true; //true to load 1st row
function photoLoaded()
{
        isPhotoLoaded = true;
}

function sort_cols(arr_col, indexs) {
        for (let i=0; i<arr_col.length; i++){
                indexs[i][0] = i;
                indexs[i][1] = arr_col[i].scrollHeight;
        }
        indexs.sort(function(a,b) {
                return a[1]-b[1]
        });
}

function gallery_init(arr, gallery_container, cols, css_file_path, template, load_delay){
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
                var indexs = Array(cols).fill().map(() => Array(2).fill(0));
                console.log(indexs);
                let cnt = 0;

                for (let i=0; i<cols; i++) {
                        //partitions the container into n columns, writes columns into array
                        let col = `<div id="col_${i}${_gallID}" class="gallery_col"><div id="wrapper_col_${i}${_gallID}"></div></div>`;
                        container.insertAdjacentHTML("beforeend", col);
                        arr_col.push(document.getElementById(`wrapper_col_${i}${_gallID}`));
                }
                for (let i=0; i<arr.length; i++){
                        let entry = template(arr[i]);

                        if (cnt === 0) {
                                sort_cols(arr_col, indexs);
                        }

                        if (cnt === (cols-1)){
                                //when last entry in a row is loaded, new row is added
                                isPhotoLoaded = false;
                                entry = entry.replace(/(<img\b)/gi, '$1 onload="photoLoaded();"');
                        }
                        //new entries are set to shortest columns per row
                        arr_col[indexs[cnt][0]].insertAdjacentHTML("beforeend", entry);

                        if (cnt > (cols-2)) {
                                cnt = 0;
                        } else {
                                cnt++;
                        }

                        while (!isPhotoLoaded) {
                                await _delay(timeout);
                        }
                }
        });
}

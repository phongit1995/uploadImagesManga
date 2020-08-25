import express from 'express';
import {getDetialChapter,UploadImages} from './ModelUpdate';
import {getData,putData} from './../../common/cache';
const router = express.Router();
let dataUpload =[];
router.post("/",
    async(req,res)=>{
        try {
            let {chapterId} = req.body ;
            let dataSave = getData(chapterId);
            if(dataSave){
                return res.status(200).jsonp({
                    status:"Loading"
                });
            }
            putData(chapterId,"aaa");
            dataUpload.push(chapterId);
            if(dataUpload.length>=5){
                return res.status(200).jsonp({
                    status:"Full"
                });
            }

            let chapterInfo  = await getDetialChapter(chapterId);
            if(chapterInfo.status_update_images){
                return res.status(200).jsonp({
                    status:"success"
                })
            }
            let ListPromise = chapterInfo.images.map((item)=>{
                return UploadImages(item);
            })
            let resultPromise = await Promise.all(ListPromise);
            chapterInfo.images = resultPromise ;
            chapterInfo.status_update_images=true ;
            chapterInfo.save();
            dataUpload.splice(4,1);
            return res.status(200).jsonp({
                status:"success",
                data:chapterInfo
            });
        } catch (error) {
            console.log(error);
            return res.status(200).jsonp({
                status:JSON.stringify(error)
            })
        }
       
    })
export default router ;
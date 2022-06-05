const { default: mongoose } = require('mongoose');
const HttpError = require('../models/http-error')

const NewCategory = require('../models/model');
const newCategory = async (req, res, next) => {

    const categoryId = req.params.cid;
    const { category_name, level, target_sale, current_sale} = req.body;
    
    const progressPresent = ((current_sale/target_sale)*100);
    console.log(progressPresent);

    let barColour = '';
    let progressLabel = '';

    if(progressPresent<=33){
        barColour = "Red";
        progressLabel = "At risk";
    }else if((progressPresent>33)&&(progressPresent<=66)){
        barColour = "Yellow";
        progressLabel = "off track";
        
    }else if(progressPresent>66){
        barColour = "Green";
        progressLabel = "on track";
        
    }

    console.log(barColour);
    console.log(progressLabel);
      
    
    
    //const existingCategory = await NewCategory.findOne({ category_name: category_name});
    let existingCategory
    try{
        existingCategory = await NewCategory.findOne({ category_name: category_name});
    }catch (err) {
        const error = new HttpError(' creating new category failed', 500);
        return next(error);
    }

    if (existingCategory){
        const error = new HttpError('category already exist, please update instead', 422);
        return next(error);
    }

    const createdCategory = new NewCategory({
        category_name,
        parentId: categoryId,
        level,
        target_sale,
        current_sale,
        progress_persent: progressPresent,
        bar_colour: barColour,
        progress_label: progressLabel,
        childNode: []
    })
    //await createdCategory.save();
    let parentNode
    try{
        parentNode = await NewCategory.findById(parentId);
    }catch (err){
        const error = new HttpError('Creating new category failed.', 500);
        return next(error);
    }

    if (!parentNode){
        const error = new HttpError('could not find the category', 404);
        return next(error);
    }

    console.lod(parentNode);
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdCategory.save({ session: sess });
        parentNode.childNode.push(createdCategory);
        await URLSearchParams.save({ session: sess});
        await sess.commitTransaction();

    }catch (err){
        const error = new HttpError('creating new category failed please tey again later', 500);
        return next(error);
    }

    res.status(201).json({ category: createdCategory.toObject({ getters: true})});

}

const getCategoryByCid = async (req, res, next) => {
    const categoryId = req.params.cid;

    let category;
    try{
        category = await NewCategory.findById(categoryId);
    }catch (err){
        const error = new HttpError('something went wrong could not find the particular category', 500);
        return next(error);
    }
    
    if(!category){
        const error = new HttpError('could not fir the category for the provided Id.', 404);
        return next(error);
    }
    res.json({category: category.toObject({ getters: true}) });
}

const updateCategory = async (req, res, next) => {
    
    const categoryId = req.params.cid;
    const { target_sale, current_sale} = req.body;
     
     
     const progressPresent = ((current_sale/target_sale)*100);
    console.log(progressPresent);

    let barColour = '';
    let progressLabel = '';

    if(progressPresent<=33){
        barColour = "Red";
        progressLabel = "At risk";
    }else if((progressPresent>33)&&(progressPresent<=66)){
        barColour = "Yellow";
        progressLabel = "off track";
        
    }else if(progressPresent>66){
        barColour = "Green";
        progressLabel = "on track";
        
    }

    console.log(barColour);
    console.log(progressLabel);

     let updatecategory;
     try{
         updatecategory = await NewCategory.findById(categoryId);
     }catch (err){
         const error = new HttpError('something went wrong could not update category', 500);
         return next(error);
     }

     updatecategory.target_sale = target_sale;
     updatecategory.current_sale = current_sale;
     updatecategory.progress_persent = progressPresent; 
     updatecategory.bar_colour = barColour;
     updatecategory.progress_label = progressLabel;

     try{
         await updatecategory.save()
     }catch (err) {
         const error = new HttpError('Something went wrong could not update the category sorry, please try again.', 500);
         return next(error);
     }

     res.status(200).json({ updatecategory: updatecategory.toObject({ getters:true})});
};


exports.newCategory = newCategory;
exports.getCategoryByCid = getCategoryByCid;
exports.updateCategory = updateCategory;
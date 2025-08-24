const expressAsyncHandler = require("express-async-handler")
const { Cause, validateCreateCause, validateDonateAmount } = require("../model/Causes")
const { cloudinaryRemoveImage } = require("../config/cloudinary")
const { default: mongoose } = require("mongoose")
const { User } = require("../model/User")


/**
 * @dec create a new cause
 * @route POST /api/cause
 * @access Private
 */
const createCause = expressAsyncHandler(async (req, res) => {
    const {error} = validateCreateCause(req.body)
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }
  const cause = await Cause.create({
    title : req.body.title,
    description : req.body.description,
    image : req.file.path,
    imagePublicId : req.file.filename,
    goal : req.body.goal
  })
  return res.status(201).json(cause)
})

/**
 * @desc Get all causes
 * @route GET /api/causes
 * @access Public
 */
const getAllCauses = expressAsyncHandler(async (req, res) => {

  const causes = await Cause.find().sort({ createdAt: -1 });
    res.status(200).json(causes);
});

/**
 * @desc Get a single cause by ID
 * @route GET /api/causes/:id
 * @access Public
 */
const getSingleCause = expressAsyncHandler(async (req, res) => {
    const cause = await Cause.findById(req.params.id);
    
    if (cause) {
        res.status(200).json(cause);
    } else {
        res.status(404).json({ message: "Cause not found" });
    }
});


/**
 * @desc Donate to a cause
 * @route POST /api/causes/donate/:id
 * @access Private (only for logged in users)
 */
const donateToCause = expressAsyncHandler(async (req, res) => {
  console.log(req.user)
    // 1. التحقق من مبلغ التبرع
    const { error } = validateDonateAmount(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { amount } = req.body;
    const session = await mongoose.startSession(); // بدء جلسة transaction
    
    try {
        session.startTransaction(); // بدء الـ transaction

        // 2. البحث عن القضية
        const cause = await Cause.findById(req.params.id).session(session);
    
        if (!cause) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Cause not found" });
        }

        // 3. التحقق مما إذا كانت القضية قد وصلت لهدفها
        if (cause.raised >= cause.goal) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "This cause has already reached its goal" });
        }

        // 4. البحث عن المستخدم (من خلال الـ middleware)
        const user = await User.findById(req.user.id).session(session);
        if (!user) {
             await session.abortTransaction();
             session.endSession();
             return res.status(404).json({ message: "User not found" });
        }

        // 5. التحقق من رصيد المستخدم
        if (user.wallet < amount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Insufficient balance in your wallet" });
        }
        if(amount > cause.goal) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "The target is less than the sent value" });
        }
        // 6. تنفيذ عملية الدفع (خصم من المستخدم وإضافة للقضية)
        user.wallet -= amount;
        cause.raised += amount;

        // 7. حفظ التغييرات
        await user.save();
        await cause.save();

        // 8. تأكيد الـ transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: "Donation successful!",
            cause,
            newBalance: user.walletBalance
        });

    } catch (transactionError) {
    // في حال حدوث أي خطأ، يتم التراجع عن كل العمليات
    await session.abortTransaction();
    session.endSession();

    console.error("TRANSACTION ERROR:", transactionError);

    res.status(400).json({ 
        message: "Donation failed", 
        error: transactionError.message 
    });
  }
});


/**
 * @desc Delete a cause
 * @route DELETE /api/causes/:id
 * @access Private (only admin)
 */
const deleteCause = expressAsyncHandler(async (req, res) => {
    // 1. ابحث عن القضية في قاعدة البيانات
    const cause = await Cause.findById(req.params.id);

    if (!cause) {
        return res.status(404).json({ message: "Cause not found" });
    }

    // 2. احذف الصورة من Cloudinary
    await cloudinaryRemoveImage(cause.imagePublicId);

    // 3. احذف القضية من قاعدة البيانات
    await Cause.findByIdAndDelete(req.params.id);

    // 4. أرسل رسالة نجاح
    res.status(200).json({ message: "Cause has been deleted successfully" });
});


module.exports = {
    createCause,
    getAllCauses,
    getSingleCause,
    donateToCause,
    deleteCause
}
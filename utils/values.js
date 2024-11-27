
const ACADEMIC_YEARS = {
    "GRADE 4 PRIMARY": "الصف الرابع الابتدائي",
    "GRADE 5 PRIMARY": "الصف الخامس الابتدائي",
    "GRADE 6 PRIMARY": "الصف السادس الابتدائي",
    "GRADE 1 PREPARATORY": "الصف الأول الإعدادي",
    "GRADE 2 PREPARATORY": "الصف الثاني الإعدادي",
    "GRADE 3 PREPARATORY": "الصف الثالث الإعدادي",
    "GRADE 1 SECONDARY": "الصف الأول الثانوي",
    "GRADE 2 SECONDARY": "الصف الثاني الثانوي",
    "GRADE 3 SECONDARY": "الصف الثالث الثانوي",
    "GRADE 1 UNIVERSITY": "الفرقة الأولى",
    "GRADE 2 UNIVERSITY": "الفرقة الثانية",
    "GRADE 3 UNIVERSITY": "الفرقة الثالثة",
    "GRADE 4 UNIVERSITY": "الفرقة الرابعة"
}

const referMethods = {
    'FRIEND': 'صديق', 
    'SOCIAL-MEDIA': 'منصات التواصل الاجتماعي', 
    'ADVERTISEMENT': 'اعلانات', 
    'WORD-OF-MOUTH': 'الطلاب السابقون', 
    'SCHOOL': 'مدرسة', 
    'OTHER': 'اخري'
}

const genderTypes = {
    'MALE': 'ذكر',
    'FEMALE': 'انثي'
}

const EXAM_TYPES = {
    "WRITTEN": "مكتوب",
    "PRACTICAL": "عملي",
    "ORAL": "شفوي",
    "PROJECT-BASED": "قائم على المشروع",
    "ONLINE/DIGITAL": "عبر الإنترنت/رقمي",
    "PRACTICAL PERFORMANCE": "أداء عملي",
    "OPEN BOOK": "كتاب مفتوح",
    "COMPREHENSIVE": "شامل",
    "QUIZ": "اختبار قصير",
    "MID-TERM": "منتصف الفصل",
    "FINAL": "نهائي"
}

const EXAM_SUBTYPES = {
    "ESSAY": "مقال",
    "SHORT ANSWER": "إجابة قصيرة",
    "MULTIPLE CHOICE": "اختيار من متعدد",
    "TRUE/FALSE": "صواب/خطأ",
    "FILL IN THE BLANKS": "املأ الفراغات",
    "LAB": "مختبر",
    "DEMONSTRATION": "عرض",
    "ORAL": "شفوي",
    "PRESENTATION": "عرض تقديمي",
    "RESEARCH PROJECT": "مشروع بحثي",
    "GROUP PROJECT": "مشروع جماعي",
    "TIMED ONLINE TEST": "اختبار عبر الإنترنت محدد بوقت",
    "SKILL TEST": "اختبار مهارات",
    "FIELDWORK": "عمل ميداني",
    "OPEN BOOK": "كتاب مفتوح",
    "TAKE-HOME": "امتحان منزلي"
}

const SUBSCRIPTION_STATUS = {
    'ACTIVE': 'نشط', 
    'EXPIRED': 'منتهي', 
    'CANCELLED': 'ملغي'
}

const ATTENDANCE_STATUS = {
    'PRESENT': 'حضر', 
    'ABSENT': 'غائب', 
    'EXCUSED': 'معتذر'
}

const SUBMISSION_STATUS = {
    'PENDING': 'قيد الانتظار', 
    'SUBMITTED': 'تم التسليم',
    'UNSUBMITTED': 'لم يسلم'
}

const PAYMENT_METHODS = {
    'CASH': 'كاش', 
    'CARD': 'بطاقات الدفع', 
    'E-WALLET': 'محفظة الكترونية'
}

module.exports = { ACADEMIC_YEARS, SUBSCRIPTION_STATUS, ATTENDANCE_STATUS, PAYMENT_METHODS, SUBMISSION_STATUS, EXAM_TYPES }
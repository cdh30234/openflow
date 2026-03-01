
const translations = {
    "en": {
        "dashboard_title": "OpenFlow Dashboard",
        "todo_column": "To Do",
        "inprogress_column": "In Progress",
        "done_column": "Done",
        "add_new_item": "New Item",
        "priority": "Priority",
        "high": "High",
        "normal": "Normal",
        "low": "Low",
        "completed": "Completed",
        "search_tasks": "Search tasks...",
        "profile": "Profile",
        "settings": "Settings",
        "logout": "Logout",
        "overview": "Overview",
        "content_pipeline": "Content Pipeline",
        "memory_bank": "Memory Bank",
        "calendar": "Calendar",
        "digital_office": "Digital Office",
        "team": "Team",
        "q3_product_launch": "Q3 Product Launch",
        "define_weekly_review_routine": "Define Weekly Review Routine",
        "check_n8n_connections": "Check N8N Connections",
        "upgrade_dashboard_v2": "Upgrade Dashboard v2",
        "build_content_pipeline_tool": "Build Content Pipeline Tool",
        "seo_keyword_optimization": "SEO Keyword Optimization",
        "finalize_terms_of_service": "Finalize Terms of Service",
        "add_task_to_do": "Add Task To Do",
        "reviewer": "Reviewer",
        "needs_approval": "Needs Approval"
    },
    "ar": {
        "dashboard_title": "لوحة تحكم OpenFlow",
        "todo_column": "قائمة المهام",
        "inprogress_column": "قيد التنفيذ",
        "done_column": "تم الإنجاز",
        "add_new_item": "عنصر جديد",
        "priority": "الأولوية",
        "high": "عالية",
        "normal": "عادية",
        "low": "منخفضة",
        "completed": "مكتملة",
        "search_tasks": "ابحث عن المهام...",
        "profile": "الملف الشخصي",
        "settings": "الإعدادات",
        "logout": "تسجيل الخروج",
        "overview": "نظرة عامة",
        "content_pipeline": "مسار المحتوى",
        "memory_bank": "بنك الذاكرة",
        "calendar": "التقويم",
        "digital_office": "المكتب الرقمي",
        "team": "الفريق",
        "q3_product_launch": "إطلاق منتج الربع الثالث",
        "manage_release_campaign": "إدارة مهام حملة الإطلاق القادمة",
        "define_weekly_review_routine": "تحديد روتين المراجعة الأسبوعية",
        "check_n8n_connections": "التحقق من اتصالات N8N",
        "upgrade_dashboard_v2": "ترقية لوحة التحكم الإصدار 2",
        "build_content_pipeline_tool": "بناء أداة مسار المحتوى",
        "seo_keyword_optimization": "تحسين محركات البحث",
        "add_task": "إضافة مهمة",
        "review_column": "مراجعة",
        "finalize_terms_of_service": "الانتهاء من شروط الخدمة",
        "add_task_to_do": "إضافة مهمة للقيام بها",
        "reviewer": "المراجع",
        "needs_approval": "يحتاج إلى موافقة",
        "become_pro_access": "الحصول على الوصول الاحترافي",
        "try_more_features": "جرب المزيد من الميزات",
        "upgrade_pro": "الترقية إلى Pro"
    }
};

function setLanguage(lang) {
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
        const key = element.getAttribute("data-i18n-placeholder");
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });

    if (lang === "ar") {
        document.documentElement.setAttribute("dir", "rtl");
    } else {
        document.documentElement.setAttribute("dir", "ltr");
    }
    localStorage.setItem("lang", lang);
}

document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("lang") || "ar";
    setLanguage(savedLang);

    // Language switcher event listener (assuming you'll add buttons in index.html)
    document.getElementById("lang-switcher-en")?.addEventListener("click", () => setLanguage("en"));
    document.getElementById("lang-switcher-ar")?.addEventListener("click", () => setLanguage("ar"));
});

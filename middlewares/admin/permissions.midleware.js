// Product 
module.exports.editProduct = (req, res, next) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes("product_edit")) {
        next();
    } else {
        req.flash("errorMessage", "Tài khoản của bạn không có quyền này!");
        res.redirect("back");
    }
};

module.exports.createProduct = (req, res, next) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes("product_create")) {
        next();
    } else {
        req.flash("errorMessage", "Tài khoản của bạn không có quyền này!");
        res.redirect("back");
    }
};

module.exports.deleteProduct = (req, res, next) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes("product_delete")) {
        next();
    } else {
        req.flash("errorMessage", "Tài khoản của bạn không có quyền này!");
        res.redirect("back");
    }
};
// End product 

// Products-category
module.exports.editProductsCategory = (req, res, next) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes("products-category_edit")) {
        next();
    } else {
        req.flash("errorMessage", "Tài khoản của bạn không có quyền này!");
        res.redirect("back");
    }
};

module.exports.createProductsCategory = (req, res, next) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes("products-category_edit")) {
        next();
    } else {
        req.flash("errorMessage", "Tài khoản của bạn không có quyền này!");
        res.redirect("back");
    }
};
// End products-category

// Role 
module.exports.editRole = (req, res, next) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes("roles_edit")) {
        next();
    } else {
        req.flash("errorMessage", "Tài khoản của bạn không có quyền này!");
        res.redirect("back");
    }
};

module.exports.createRole = (req, res, next) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes("roles_create")) {
        next();
    } else {
        req.flash("errorMessage", "Tài khoản của bạn không có quyền này!");
        res.redirect("back");
    }
};

module.exports.permissionsRole = (req, res, next) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes("roles_permissions")) {
        next();
    } else {
        req.flash("errorMessage", "Tài khoản của bạn không có quyền này!");
        res.redirect("back");
    }
};
// End role 

// Account 
module.exports.editAccount = (req, res, next) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes("accounts_edit")) {
        next();
    } else {
        req.flash("errorMessage", "Tài khoản của bạn không có quyền này!");
        res.redirect("back");
    }
};

module.exports.createAccount = (req, res, next) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes("accounts_create")) {
        next();
    } else {
        req.flash("errorMessage", "Tài khoản của bạn không có quyền này!");
        res.redirect("back");
    }
};
// End account 

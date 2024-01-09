module.exports.newPriceOfProducts = (products) => {
    const newProducts = products.map(item => {
        item.newPrice = (item.price * (100 -  item.discountPercentage) / 100).toFixed()
        return item
    })
    return newProducts
}

module.exports.newPriceOfProduct = (product) => {
    const newPrice = (product.price * (100 -  product.discountPercentage) / 100).toFixed()
    return newPrice
}

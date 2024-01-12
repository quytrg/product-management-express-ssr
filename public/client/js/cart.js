const quantityInputs = document.querySelectorAll('input[name="quantity"]')
if (quantityInputs) {
    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            const productId = input.getAttribute('product-id')
            const quantity = parseInt(input.value) 
            
            if (quantity > 0) {
                window.location.href = `/cart/update-quantity/${productId}/${quantity}`
            }
        })
    })
}

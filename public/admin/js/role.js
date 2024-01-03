// Permission 
const permissionTable = document.querySelector('[permission-table]')
if (permissionTable) {
    const submitButton = document.querySelector('[submit-button]')
    submitButton.addEventListener('click', () => {
        let result = [] 
        const rows = permissionTable.querySelectorAll('[data-name]')
        rows.forEach(row => {
            const inputs = row.querySelectorAll('input')
            const name = row.getAttribute('data-name')
            
            if (name === 'id') {
                inputs.forEach(item => {
                    result.push({
                        id: item.value,
                        permissions: []
                    })
                })
            }
            else {
                inputs.forEach((item, index) => {
                    if (item.checked) {
                        result[index].permissions.push(name)
                    }
                })
            }
        })

        const formChangePermission = document.querySelector('#form-change-permission')
        if (formChangePermission) {
            const inputPermission = formChangePermission.querySelector('input')
            const data = JSON.stringify(result)
            inputPermission.value = data
            formChangePermission.submit()
        }
    })
}
// End permission 

// Current permission state
const formChangePermission = document.querySelector('#form-change-permission')
if (formChangePermission) {
    const inputPermission = formChangePermission.querySelector('input')
    const data = JSON.parse(inputPermission.value)
    
    data.forEach((item, index) => {
        const permissions = item.permissions
        permissions.forEach(permission => {
            const row = permissionTable.querySelector(`tr[data-name="${permission}"]`)
            const input = row.querySelectorAll('input')[index]
            input.checked = true
        })
    })
}
// End current permission state 

import { userServices } from '../services/user'
import { ipcMain } from 'electron'

const logPrefix = `[IPC > db/controller/user]`

ipcMain.handle('db/user/getList', async (event, arg) => {
  try {
    const result = await userServices.getUserList()
    return result
  } catch (error) {
    return { code: 500, msg: `Error getting user list: ${error.message}` }
  }
})

ipcMain.handle('db/user/addOrUpdate', async (event, arg) => {
  try {
    const data = arg
    let res
    
    if (data.id) {
      res = await userServices.updateUserById(data.id, data)
    } else {
      const newData = { ...data }
      delete newData.id
      res = await userServices.insertUser(newData)
    }
    
    return res
  } catch (error) {
    return { code: 500, msg: `Error adding/updating user: ${error.message}` }
  }
})

ipcMain.handle('db/user/getInfoById', async (event, { id }) => {
  try {
    const result = await userServices.getUserById(id)
    return result
  } catch (error) {
    return { code: 500, msg: `Error getting user info: ${error.message}` }
  }
})

ipcMain.handle('db/user/deleteById', async (event, { id }) => {
  try {
    const result = await userServices.deleteUserById(id)
    return result
  } catch (error) {
    return { code: 500, msg: `Error deleting user: ${error.message}` }
  }
})

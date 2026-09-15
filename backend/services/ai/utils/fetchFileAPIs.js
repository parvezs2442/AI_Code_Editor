import "dotenv/config"
import axios from "axios"

const getFileUrl = () => process.env.FILE_SERVICE_URL || "http://localhost:3003"

export const createFolder = async ({ projectId, parentId, name, userId }) => {
    try {
        const { data } = await axios.post(`${getFileUrl()}/create-folder`,
            { projectId, parentId, name },
            {
                headers: {
                    "x-user-id": String(userId)
                }
            }
        )

        return data
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || "Failed to create folder")
    }
}

export const createFile = async ({ projectId, name, parentId, content = "", language = "plaintext", userId }) => {
    try {
        const { data } = await axios.post(`${getFileUrl()}/create-file`,
            { projectId, name, parentId, content, language },
            {
                headers: {
                    "x-user-id": String(userId)
                }
            }
        )

        return data
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || "Failed to create file")
    }
}

export const updateFile = async ({ name, content = "", userId, id }) => {
    try {
        const { data } = await axios.post(`${getFileUrl()}/update/${id}`,
            { name, content },
            {
                headers: {
                    "x-user-id": String(userId)
                }
            }
        )

        return data
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || "Failed to update file")
    }
}

export const deleteFile = async ({ userId, id }) => {
    try {
        const { data } = await axios.delete(`${getFileUrl()}/${id}`,
            {
                headers: {
                    "x-user-id": String(userId)
                }
            }
        )

        return data
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || "Failed to delete file")
    }
}

export const getTree = async ({ userId, projectId }) => {
    try {
        const { data } = await axios.get(`${getFileUrl()}/tree/${projectId}`,
            {
                headers: {
                    "x-user-id": String(userId)
                }
            }
        )

        return data
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || "Failed to get file tree")
    }
}

export const getFile = async ({ userId, id }) => {
    try {
        const { data } = await axios.get(`${getFileUrl()}/${id}`,
            {
                headers: {
                    "x-user-id": String(userId)
                }
            }
        )

        return data
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || "Failed to get file")
    }
}

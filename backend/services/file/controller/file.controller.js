

export const createRootFolder = async(req,res) => {
    try{

        const {projectId, projectName} =  req.body;

        if(!projectId || !projectName){
            return res.status(400).json(  )
        }


    }catch(error){

    }
}
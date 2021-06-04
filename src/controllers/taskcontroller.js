import Task from '../models/Task';
import {getPagination} from '../libs/getPagination';

export const findAllTasks = async (req, res) => {
    try {

        console.log(req.qery);
        const {size, page, title} = req.query

        const condition = title ? {
            title: { $regex: new RegExp(title), $options: "i"}
        } : {};

        const{limit,offset} = getPagination(page,size)
	    const data = await Task.paginate(condition, { offset, limit });
        res.json({
            totalItems: data.totalDocs,
            task: data.docs,
            totalPages: data.totalPages,
            currentPage: data.page -1
        });

    } catch (error) {

        res.status(500).json({
            message: error.message || "Algo fallo al mostrar las tareas",
        })
    }
};

export const createTask = async (req, res) => {

    if(!req.body.title){
        return res.status(400).send({message: 'El contenido no puede estar vacio'});
    }

    try {
        
        const newTask = new Task({
            title: req.body.title, 
            description:req.body.description,
            done: req.body.done ? req.body.done : false
        });
        const taskSaved = await newTask.save();
        res.json(taskSaved);

    } catch (error) {
         res.status(500).json({
            message: error.message || "Algo fallo al crear la tarea",
        })
    }


};

export const findOneTask = async (req, res) => {

    const { id } = req.params;

    try {
    
        const task = await Task.findById(id);

        if(!task)
            return res
                .status(404)
                .json({ message: 'No existe la tarea con id : ' + id })

        res.json(task);
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Fallo al devolver la tarea con id: ' + id,
        });
    }

    
}

export const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        await Task.findByIdAndDelete(id);
        res.json({
            message: 'La tarea fue eliminada.'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Fallo al eliminar la tarea con id: ' + id,
        });
    }
    
}

export const findAllDoneTask = async (req, res) => {
    const tasks = await Task.find({done:true});
    res.json(tasks);

}

export const updateTask = async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, req.body);
    res.json({message: 'Tarea actualizada'});
}
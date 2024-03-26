import mongoose from "mongoose";
import express,{Request, Response} from "express";
import {StatusCodes} from "http-status-codes"

export const pokemonRouter = express.Router();

pokemonRouter.get("/pokemon", async (req, res) => {
    const pokedex = await mongoose.connection.collection('Pokedex');
    if(!pokedex) return res.status(204).json({'message': 'Pokedex not found'});
    const pokemon =  await pokedex.find().sort({id:'asc'}).limit(1025).stream()
    let result:any[] = []
    await pokemon.on('data',async doc => {
        await result.push(doc)
    })
    pokemon.on('end', () => {        
        return res.status(StatusCodes.OK).json(result);
    })
    pokemon.on('error', () => {
        return res.status(StatusCodes.BAD_GATEWAY).json({'message': 'Server issue retrieving all pokemon'});
    })
})

pokemonRouter.get("/pokemon/:id", async (req, res) => {
    const pokedex =  await mongoose.connection.collection('Pokedex');
  
    if(!pokedex) return res.status(204).json({'message': 'Pokedex not found'});
    if(!req?.params?.id) return res.status(400).json({'message': 'pokemon id is required'})
    const paramsId = req?.params?.id;
    let pokemon;
    if(isNaN(parseInt(paramsId))){
        pokemon =  await pokedex.findOne({name: {$regex: req.params.id,$options:'i'}});
    }else{
        const pkId = parseInt(paramsId);
        if(pkId > 0 && pkId < 1026)
        {
            pokemon =  await pokedex.findOne({id: parseInt(req.params.id)});
        }
    }

    if(!pokemon) return res.status(400).json({"message":`${req.params.id} not found`})
    return res.status(StatusCodes.OK).json(pokemon);
});

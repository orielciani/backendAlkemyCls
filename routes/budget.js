const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Budget = require('../models/budget');
const mdAuth = require('../middleware/auth');

// Get budget
app.get('/', [mdAuth.verifyToken], (req, res) => {
  const user = req.user.user;
  Budget.find({}, 'concept amount user date type class',)
  .or([{ 'user': user }])
  .limit(10)
  .sort({"createdDate": -1})
  .exec((err, budgets) => {
    if ( err ) {
      return res.status(400).json({
        ok: false,
        message: 'Error',
        err: err
      })
    }
    
    res.status(200).json({
      ok: true,
      message: 'Hola =) estas en Presupuesto',
      budgets: budgets,
    })
  })
});
// Get budget class
app.get('/class', [mdAuth.verifyToken], (req, res) => {
  const user = req.user.user;
  let categories = [];
  Budget.find({}, 'type class',)
  .or([{ 'user': user }])
  .exec((err, budgets) => {
    if ( err ) {
      return res.status(400).json({
        ok: false,
        message: 'Error',
        err: err
      })
    }
    res.status(200).json({
      ok: true,
      message: 'Hola =) estas en Presupuesto',
      class: budgets,
    })
  })
});


// Get budget user income
app.get('/user/:type', [mdAuth.verifyToken], (req, res) => {
  const user = req.user.user;
  const type = req.params.type;
  if ( type === 'income' ) {
    Budget.find({'type': 'income'})
      .or([{ 'user': user }])
      .exec((err, user) => {
        if ( err ) {
          return res.status(400).json({
            ok: false,
            message: 'Error',
            err: err
          })
        }
        return res.status(200).json({
          ok: true,
          message: 'Hola =) estas en presupuesto personal',
          budget: user
        })
      })
  }
  if ( type === 'expense' ) {
    Budget.find({'type': 'expense'})
      .or([{ 'user': user }])
      .exec((err, user) => {
        if ( err ) {
          return res.status(400).json({
            ok: false,
            message: 'Error',
            err: err
          })
        }
        return res.status(200).json({
          ok: true,
          message: 'Hola =) estas en presupuesto personal',
          budget: user
        })
      })
  }


});
// Delete budget user
app.delete('/delete/:id', [mdAuth.verifyToken], (req, res) => {
  const id = req.params.id;
  Budget.findByIdAndDelete(id)
    .exec((err, operationDeleted) => {
      if ( err ) {
        return res.status(500).json({
        ok: false,
        message: 'No se pudo eliminar la operacion'
        })
      }
      if ( !operationDeleted ) {
        return res.status(400).json({
        ok: false,
        message: 'No existe una operacion con el id: ' + id
        })
      }
       res.status(200).json({
        ok: true,
        message: 'Operacon eliminada',
        budgetRemoved: operationDeleted
      })
    })

});

// Create new income-expense
app.post('/create/', [mdAuth.verifyToken], (req, res) => {
    const body = req.body;
    const createdDate = new Date();
    if ( !body.user || !body.concept || !body.amount || !body.date || !body.type || !body.class ) {
        return res.status(400).json({
        ok: false,
        message: 'Debe llenar todo el formulario para registrarse',
      })
      }

      const budget = new Budget({
          user: body.user,
          concept: body.concept,
          amount: body.amount,
          date: body.date,
          createdDate: createdDate,
          type: body.type,
          class: body.class
      })

      budget.save( (err, savebudget) => {
          if (err) {
              res.status(400).json({
                  ok: false,
                  message: 'Error',
                  err: err
              })
          }
          res.status(200).json({
            ok: true,
            message: 'Hola =) creaste un nuevo ingreso o egreso',
            budget: savebudget
          })
      } )
});

// Adjust income-expense
app.put('/adjust/:id', [mdAuth.verifyToken], (req, res) => {
    const body = req.body;
    const id = req.params.id;
    Budget.findById(id, (err, budget) => {
      if(!budget) {
        return res.status(400).json({
          ok: false,
          message: 'No existe un presupuesto con el id ' + id + ' por lo tanto no se puede actualizar'
        })
        }
      if (err) {
        res.status(400).json({
          ok: false,
          message: 'Error',
          err: err
        })
      }
        budget.concept = body.concept;
        budget.amount = body.amount;
        budget.date = body.date;
        budget.class = body.class;
        budget.save( (err, budgetUpdated) => {
          if ( err ) {
            res.status(400).json({
              ok: false,
              message: 'Error',
              err: err
            })
          }
          res.status(200).json({
            ok: true,
            message: 'Operacion actualizada',
            budget: budgetUpdated
          })
        } )
    })
});





module.exports = app;
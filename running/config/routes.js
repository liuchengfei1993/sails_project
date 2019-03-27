/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/': { view: 'index' },
  '/': 'UsersController.index',
  'GET /users': { action: 'users/logout' },
  // 'GET /users': 'users/logout' 与之相同
  '/users/login': { action: 'users/login' },
  // 'get /users/lcf': { view: 'users/lcf' },
  'users/update': { action: 'users/update' },
  'users/delete': { action: 'users/delete' },
  'users/acount': { action: 'users/acount' },
  'users/sort': 'user.sort',
  'POST /api/v1/person/sigup': { action: 'person/sigup' }
  


};

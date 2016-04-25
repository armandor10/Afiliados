<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::group(['middleware' => ['web']], function () {
    //
});

Route::post('Afiliado/getAfixActa','afiliadoCtr@getAfixActa');

Route::get('Afiliado','afiliadoCtr@index');
Route::get('Afiliado/birthdays','afiliadoCtr@getBirthdays');
Route::post('Afiliado','afiliadoCtr@store');
Route::put('Afiliado/{id}','afiliadoCtr@update');
Route::delete('Afiliado/{id}','afiliadoCtr@destroy');
Route::post('Afiliado/MuniEstado','afiliadoCtr@getAfiliados');

Route::post('Afiliado/upload','DocumentosCtr@upload');
Route::post('Afiliado/Documento','DocumentosCtr@getDocumento');

Route::get('Acta','ActaCtr@index');
Route::post('Acta','ActaCtr@store');
Route::get('Acta/{id}','ActaCtr@show');
Route::put('Acta/{id}','ActaCtr@update');
Route::post('Acta/upload','ActaCtr@upload');
Route::get('Vigencia','ActaCtr@getActas');
Route::post('HisActas','ActaCtr@storeHisActas');
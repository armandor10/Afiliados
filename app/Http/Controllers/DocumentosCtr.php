<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Http\Controllers\Controller;

use App\Models\Documentos;
use App\Models\Afiliado;
use DB;

class DocumentosCtr extends Controller
{
    public function getDocumento(Request $request){
        $data = $request->all();
        $documentos = Documentos::where( 'claseDocumento','=',$data['claseDocumento'] )
                ->where( 'afiliado','=',$data['afiliado'] )->first();
        if( ! empty($documentos) ){
            return JsonResponse::create(array('state'=>'OK', "request" => $documentos), 200);            
        } else {
            return JsonResponse::create(array('state'=>'KO', "request" => ''), 200);               
        }
    }

    public function upload(Request $request){
        if ($request->hasFile('file')) {
            $data = $request->all();
            $afiliado = Afiliado::find($data['afiliado']);
            
            $documentos = Documentos::where('claseDocumento','=',$data['claseDocumento'])
                    ->where('afiliado','=',$data['afiliado'])->first();
            if( empty($documentos) ){
                $documentos = new Documentos();
                $documentos->claseDocumento = $data['claseDocumento'];
                $documentos->afiliado = $data['afiliado'];
            }            
            
            $file = $request->file('file');
            $file->move( public_path().'/'.$afiliado->noIdentificacion, $data['claseDocumento'].'.pdf' );
            

            $documentos->path = $afiliado->noIdentificacion.'/'.$data['claseDocumento'].'.pdf';
            $documentos->save();
            
            return 'Cargado';
        }else{
            return 'No cargado';
        } 
        //return $request->file();
    }
   
}

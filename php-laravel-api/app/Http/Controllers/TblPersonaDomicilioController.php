<?php

namespace App\Http\Controllers;

use App\Http\Requests\TblPersonaDomicilioAddRequest;
use App\Http\Requests\TblPersonaDomicilioEditRequest;
use App\Models\TblPersonaDomicilio;
use Illuminate\Http\Request;

class tblPersonaDomicilioController extends Controller
{
    /**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	function edit(TblPersonaDomicilioEditRequest $request, $rec_id = null){
		$query = TblPersonaDomicilio::query();
		$record = $query->where('perd_per_id', $rec_id)->first();
	
		if ($request->isMethod('post')) {
			$modeldata = $request->validated();
	
			if ($record) {
				$record->update($modeldata);
			} else {
				$modeldata['perd_per_id'] = $rec_id;
				$record = TblPersonaDomicilio::create($modeldata);
			}
		}
	
		return $this->respond($record);
	}
	
}

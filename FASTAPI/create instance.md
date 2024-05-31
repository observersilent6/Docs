
# Create a new scenario
@router.post("/add", summary="Create a new scenario", response_model=ScenarioPublic,name="scenarios:create-new-scenario",  status_code=HTTP_201_CREATED)
async def add_scenario(request:ScenarioCreate, db:Session = Depends(get_db)):
    try:
        new_scenario  = ScenarioModel(**request.model_dump())
        db.add(new_scenario)
        db.commit()
        db.refresh(new_scenario)
        return new_scenario
    except HTTPException as e:
        raise HTTPException(status_code=500, detail=str(e.detail))
    except IntegrityError as e:
        raise HTTPException(status_code=500, detail=str(e._message()))
    except Exception as e:
        print(e)
        return JSONResponse(  
            status_code=418,
            content={"message": f"{INTERNAL_SERVER_ERROR_500_MESSAGE}"},
        )
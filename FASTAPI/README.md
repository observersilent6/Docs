**Role Based Access**


https://medium.com/@abdulwasa.abdulkader/how-to-implement-a-simple-role-based-access-control-rbac-in-fastapi-using-middleware-af07d31efa9f



**Effortless Exception Error Handling in FastAPI: A Clean and Simplified Approach**

https://python.plainenglish.io/effortless-exception-error-handling-in-fastapi-a-clean-and-simplified-approach-db6f6a7a497c

**How to use FastAPI UploadFile with Pydantic model**

https://olubiyiontheweb.medium.com/how-to-use-fastapi-uploadfile-with-pydantic-model-e9a8a5b2b264

**SQLAlchemy ORDER BY DESCENDING?**

https://stackoverflow.com/questions/4186062/sqlalchemy-order-by-descending

dockers = db.query(DockerModel).order_by(desc(DockerModel.id))

**How to log a Python exception?**

https://www.geeksforgeeks.org/how-to-log-a-python-exception/#:~:text=Logging%20an%20exception%20in%20Python,interpreted%20as%20for%20debug().


**Update(PUT) Method


# Update a property by id   
@router.put("/properties/{property_id}/update", summary="Update a property by id", response_model=PropertyOut,name="dockers:update-property-by-id",  status_code=HTTP_200_OK)
async def update_property_by_id(property: PropertyBase,property_id: int = Path(..., title="The ID of the property to get", ge=1),  db:Session = Depends(get_db)):
    try:
        stored_property_model = db.query(PropertyModel).filter(PropertyModel.id == property_id).first()
        if not stored_property_model:
            raise HTTPException(status_code=404, detail="Property not found")
        stored_property_data = jsonable_encoder(stored_property_model)
        update_data = property.dict(exclude_unset = True)
        stored_property_data.update(update_data)
        for key, value in update_data.items():
            setattr(stored_property_model, key, value)
        db.commit()
        db.refresh(stored_property_model)
        propertyOut = PropertyOut(**stored_property_model.__dict__)
        return propertyOut
    except Exception as e:
        print(e)
        return JSONResponse(
            status_code=418,
            content={"message": f"{settings.INTERNAL_SERVER_ERROR_500_MESSAGE}"},
        )
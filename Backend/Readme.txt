----------------Auth system----------


Super Admin resgister

url= localhost:4000/api/auth/superadminregister

request body:
    {
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "gender": "Male",
  "Address": {
    "addressline1": "123 Main Street",
    "addressline2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  }
}



response --

{
    "error": true,
    "message": "Super Admin register successfully",
    "data": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "gender": "Male",
        "Address": {
            "addressline1": "123 Main Street",
            "addressline2": "Apt 4B",
            "city": "New York",
            "state": "NY",
            "zip": "10001"
        },
        "isBanned": {
            "status": false
        },
        "role": "SuperAdmin",
        "createdAt": "2025-05-25T00:25:14.280Z",
        "_id": "6832636b7a0fbf6be9851df8",
        "customerRef_no": "6832636b7a0fbf6be9851df8",
        "__v": 0
    }
}



-------------------------------end------------------------

##    Any user Login

url="localhost:4000/api/auth/send-otp"

request body={
     "email":"akprajapati18800@gmail.com"
}

response=

{
    "error": false,
    "message": "Otp Sent Successfully"
}


###  verify otp 

url="localhost:4000/api/auth/verify-otp"

request body={
      "email":"akprajapati18800@gmail.com",
    "otp":"387955"
}


response={

    {
    "error": false,
    "message": "User logined in Successfully",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzI2MzZiN2EwZmJmNmJlOTg1MWRmOCIsInJvbGUiOiJTdXBlckFkbWluIiwiaWF0IjoxNzQ4MTMzMjkyLCJleHAiOjE3NDgxMzQxOTJ9.dYjq2BNxTIBgHuvy8OBpNP4OoPrp1o5GAP8NXEBIo6c",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzI2MzZiN2EwZmJmNmJlOTg1MWRmOCIsImlhdCI6MTc0ODEzMzI5MiwiZXhwIjoxNzQ4NzM4MDkyfQ.paAAdGGsMlWvUlJxzPk98iEEW0TEf9mTH1R4tdYhbwc",
        "user": {
            "Address": {
                "addressline1": "123 Main Street",
                "addressline2": "Apt 4B",
                "city": "New York",
                "state": "NY",
                "zip": "10001"
            },
            "isBanned": {
                "status": false
            },
            "_id": "6832636b7a0fbf6be9851df8",
            "name": "John Doe",
            "email": "akprajapati18800@gmail.com",
            "phone": "1234567890",
            "gender": "Male",
            "role": "SuperAdmin",
            "createdAt": "2025-05-25T00:25:14.280Z",
            "customerRef_no": "6832636b7a0fbf6be9851df8",
            "__v": 0,
            "otp": null,
            "otpExpires": "1748133526445",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzI2MzZiN2EwZmJmNmJlOTg1MWRmOCIsImlhdCI6MTc0ODEzMzI5MiwiZXhwIjoxNzQ4NzM4MDkyfQ.paAAdGGsMlWvUlJxzPk98iEEW0TEf9mTH1R4tdYhbwc"
        }
    }
}
}



##  resgiter admin --------------


url='localhost:4000/api/user/adminregister'

request body= 
    {
  "name": "Ankit Kumar",
  "email": "ankit.bca.ggit@gmail.com",
  "phone": "1234567890",
  "gender": "Male",
  "Address": {
    "addressline1": "123 Main Street",
    "addressline2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  }

}


response=

{
    "error": false,
    "message": "Admin register successfully",
    "data": {
        "name": "Ankit Kumar",
        "email": "ankit.bca.ggit@gmail.com",
        "phone": "1234567890",
        "gender": "Male",
        "Address": {
            "addressline1": "123 Main Street",
            "addressline2": "Apt 4B",
            "city": "New York",
            "state": "NY",
            "zip": "10001"
        },
        "isBanned": {
            "status": false
        },
        "role": "Admin",
        "createdAt": "2025-05-25T00:58:25.375Z",
        "_id": "68326b5bf910be79e7e78c73",
        "customerRef_no": "68326b5bf910be79e7e78c73",
        "__v": 0
    }
}


note - for resgister use access_token









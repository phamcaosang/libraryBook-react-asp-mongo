import { userRequest } from "./requestMethods";

export const UserColumns = [
    {
      field: "User",
      headerName: "Username",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img className="cellImg" src={params.row.Avatar || "https://www.whitericefoundation.org/wp-content/plugins/give/assets/dist/images/anonymous-user.svg"} alt="avatar" />
            {params.row.Username}
          </div>
        );
      },
    },
    {
      field: "Fullname",
      headerName: "Full Name",
      width: 200,
    },
    {
      field: "Email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "Phone",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.Role}`}>
            {params.row.Role}
          </div>
        );
      },
    },
  ];

  export const BooksColumns = [
    {
      field: "CoverImg",
      headerName: "Image",
      width: 70,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img className="cellImg" src={params.row.CoverImg} alt="cover" />
          </div>
        );
      },
    },
    {
      field: "Title",
      headerName: "Title",
      width: 220,
    },
    {
      field: "Author",
      headerName: "Author",
      width: 220,
    },
    {
      field: "PublishDate",
      headerName: "Publish Date",
      width: 120,
    },
    {
      field: "Pages",
      headerName: "Pages",
      width: 80,
    },
    {
      field: "Price",
      headerName: "Price",
      width: 100,
    },
    {
      field: "Status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        return (
          <>
            <div className={params.row.Status}>
              {params.row.Status}
            </div>
          </>
        );
      },
    },
    
  ];


  export const TransactionColumns = [
    { field: "UserId", headerName: "UserId", width: 250 },
    {
        field: "quantity",
        headerName: "Quantity",
        width: 100,
        renderCell: (params) => {
          return (
            <>
              {params.row.BookIds?.length}
            </>
          );
        },
      },
      {
        field: "SubmitDate",
        headerName: "Submit Date",
        width: 150,
        renderCell: (params) => {
          return (
            <>
              {params.row.SubmitDate?.slice(0, 10)}
            </>
          );
        },
      },
      {
        field: "ExpireDate",
        headerName: "Expire Date",
        width: 150,
        renderCell: (params) => {
          return (
            <>
              {params.row.ExpireDate?.slice(0, 10)}
            </>
          );
        },
      },
    {
        field: "Status",
        headerName: "Status",
        width: 200,
        renderCell: (params) => {
          let status = params.row.Status
          const updateStatus = async (status)=>{
            const upDatedData = {...params.row, Status: status}
            return await userRequest.put("Transaction/"+params.row.Id, upDatedData)
          }
          
          const handleChange = (e)=>{
            updateStatus(e.target.value).then(res=>{
              e.target.className = "status " + e.target.value}
            ).catch(err => console.log(err))
          }
          return (
            <>
            <select className={"status " + status} onChange = {handleChange} defaultValue={status}>      
                {["Pending", "Accepted", "Refused", "Expired", "Done"].map(item => 
                  <option key = {item}>{item}</option>)
                }
            </select>
            </>
          );
        },
      },
  ];

  


  
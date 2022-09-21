using Microsoft.AspNetCore.Mvc;
using BookLibrary.Services;
using BookLibrary.Models;
using BookLibrary.Authorization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookLibrary.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly IBookService bookService;
        private readonly ITransactionService transactionService;




        public TransactionController(IUserService userService, IBookService bookService, ITransactionService transactionService)
        {
            this.userService = userService;
            this.bookService = bookService;
            this.transactionService = transactionService; 

        }

        [Authorize(Role.Admin)]
        [HttpGet("stats/totalOrder")]
        public ActionResult<long> GetTransactionNum()
        {
            return transactionService.GetTotalTransaction();

        }

        [Authorize(Role.User, Role.Admin)]
        [HttpPost("create/{id}")]
        public ActionResult CreateTransaction(string id, [FromBody] Transaction transaction)
        {
            User existingUser = userService.GetById(id);
            if (existingUser == null)
            {
                return NotFound($"User with Id = {id} not found");
            }
            transactionService.CreateTransaction(transaction);
            return Ok(transaction);
        }

        [Authorize(Role.Admin)]
        [HttpGet]
        public ActionResult<List<Transaction>> GetTransactions()
        {
            var transactions = transactionService.GetAll();
            if (transactions.Any())
            {
                return transactions;
            }
            return NotFound($"Cant' find any transaction");
        }


        // GET api/<TransactionController>/5
        [Authorize(Role.Admin, Role.User)]
        [HttpGet("{transactionId}/{id}")]
        public ActionResult<Transaction> GetByIdTransaction(string transactionId, string id)
        {
            User existingUser = userService.GetById(id);
            if (existingUser == null)
            {
                return NotFound($"User with Id = {id} not found");
            }
            Transaction ts = transactionService.GetById(transactionId);
            if(ts == null)
            {
                return NotFound($"Transaction with Id = {transactionId} not found");
            }
            return ts;
        }

        // GET api/<TransactionController>/5
        [Authorize(Role.Admin)]
        [HttpGet("{id}")]
        public ActionResult<Transaction> GetByIdTransaction(string id)
        {
            Transaction ts = transactionService.GetById(id);
            if (ts == null)
            {
                return NotFound($"Transaction with Id = {id} not found");
            }
            return ts;
        }

        // GET api/<TransactionController>/5
        [Authorize(Role.Admin, Role.User)]
        [HttpGet("user/{id}")]
        public ActionResult<List<Transaction>> GetByUser(string id)
        {
            User existingUser = userService.GetById(id);
            if (existingUser == null)
            {
                return NotFound($"User with Id = {id} not found");
            }
            return transactionService.GetTransactionsByUser(id);
        }



        // PUT api/<TransactionController>/5
        [Authorize(Role.Admin, Role.User)]
        [HttpPut("{id}")]
        public ActionResult UpdateTransaction(string id, [FromBody] Transaction ts)
        {
            Transaction transaction = transactionService.GetById(id);
            if(transaction == null)
            {
                return NotFound($"transaction with Id = {id} not found");
            }
            transactionService.UpdateTransaction(id, ts);
            return Ok("Ok");
        }

        [Authorize(Role.Admin)]
        [HttpPut("refresh")]
        public ActionResult RefreshTransaction()
        {
            transactionService.RefreshTransactions();
            return Ok("Ok");
        }


        // DELETE api/<TransactionController>/5
        [Authorize(Role.Admin)]
        [HttpDelete("{id}")]
        public ActionResult DeleteTransaction(string id)
        {
            Transaction transaction = transactionService.GetById(id);
            if (transaction == null)
            {
                return NotFound($"transaction with Id = {id} not found");
            }
            transactionService.DeleteTransaction(id);
            return Ok("Ok");

        }

    }
}

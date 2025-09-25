using Microsoft.AspNetCore.Mvc;
using backend.DAL.Repositories;
using backend.Models;
using System.Collections.Generic;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubscribersController : ControllerBase
    {
        private readonly SubscribersRepository _subscribersRepository = new SubscribersRepository();

        // GET: api/Subscribers or api/Subscribers/Index
        [HttpGet]
        [HttpGet("Index")]
        public ActionResult<IEnumerable<Subscribers>> Index()
        {
            var subscribers = _subscribersRepository.GetAllSubscriberss();
            return Ok(subscribers);
        }

        // GET: api/Subscribers/Details/{id}
        [HttpGet("Details/{id}")]
        public ActionResult<Dojo> Details(int id)
        {
            var subscribers = _subscribersRepository.GetParticularSubscribers(id);
            if (subscribers == null)
                return NotFound();
            return Ok(subscribers);
        }

         // POST: api/Subscribers/Create
        [HttpPost("Create")]
        public ActionResult Create([FromBody] Subscribers subscribers)
        {
            if (subscribers == null)
                return BadRequest();
            _subscribersRepository.InsertSubscribers(subscribers);
            return CreatedAtAction(nameof(Details), new { id = subscribers.Id }, subscribers);
        }

        
        // PUT: api/Subscribers/Update/{id}
        [HttpPut("Update/{id}")]
        public ActionResult Update(int id, [FromBody] Subscribers subscribers)
        {
            if (subscribers == null || subscribers.Id != id)
                return BadRequest();

            var existing = _subscribersRepository.GetParticularSubscribers(id);
            if (existing == null)
                return NotFound();

            _subscribersRepository.UpdateSubscribers(subscribers); // You must have the UpdateSubscribers method in your repository
            return NoContent();
        }

        // DELETE: api/Subscribers/Delete/{id}
        [HttpDelete("Delete/{id}")]
        public ActionResult Delete(int id)
        {
            var existing = _subscribersRepository.GetParticularSubscribers(id);
            if (existing == null)
                return NotFound();
            _subscribersRepository.DeleteSubscribers(id);
            return NoContent();
        }
    }
}
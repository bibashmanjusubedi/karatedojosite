using Microsoft.AspNetCore.Mvc;
using backend.DAL.Repositories;
using backend.Models;
using System.Collections.Generic;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DojoController : ControllerBase
    {
        private readonly DojoRepository _dojoRepository = new DojoRepository();

        // GET: api/Dojo or api/Dojo/Index
        [HttpGet]
        [HttpGet("Index")]
        public ActionResult<IEnumerable<Dojo>> Index()
        {
            var dojos = _dojoRepository.GetAllDojos();
            return Ok(dojos);
        }

        // GET: api/Dojo/Details/{id}
        [HttpGet("Details/{id}")]
        public ActionResult<Dojo> Details(int id)
        {
            var dojo = _dojoRepository.GetParticularDojo(id);
            if (dojo == null)
                return NotFound();
            return Ok(dojo);
        }

        // POST: api/Dojo/Create
        [HttpPost("Create")]
        public ActionResult Create([FromBody] Dojo dojo)
        {
            if (dojo == null)
                return BadRequest();
            _dojoRepository.InsertDojo(dojo);
            return CreatedAtAction(nameof(Details), new { id = dojo.Id }, dojo);
        }

        // PUT: api/Dojo/Update/{id}
        [HttpPut("Update/{id}")]
        public ActionResult Update(int id, [FromBody] Dojo dojo)
        {
            if (dojo == null || dojo.Id != id)
                return BadRequest();

            var existing = _dojoRepository.GetParticularDojo(id);
            if (existing == null)
                return NotFound();

            _dojoRepository.UpdateDojo(dojo); // You must have the UpdateDojo method in your repository
            return NoContent();
        }


        // DELETE: api/Dojo/Delete/{id}
        [HttpDelete("Delete/{id}")]
        public ActionResult Delete(int id)
        {
            var existing = _dojoRepository.GetParticularDojo(id);
            if (existing == null)
                return NotFound();
            _dojoRepository.DeleteDojo(id);
            return NoContent();
        }
    }
}

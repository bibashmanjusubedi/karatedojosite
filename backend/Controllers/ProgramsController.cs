using Microsoft.AspNetCore.Mvc;
using backend.DAL.Repositories;
using backend.Models;
using System.Collections.Generic;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/Controller")]
    public class ProgramsController: ControllerBase
    {
        private readonly ProgramsRepository _programsRepository = new ProgramsRepository();

        // GET: api/Programs or api/Programs/Index
        [HttpGet]
        [HttpGet("Index")]
        public ActionResult<IEnumeraIEnumerable<Programs>> Index()
        {
            var programs = _programsRepository.GetAllProgramss();
            return Ok(programs);
        }

        
        // GET: api/Programs/Details/{id}
        [HttpGet("Details/{id}")]
        public ActionResult<Programs> Details(int id)
        {
            var programs = _programsRepository.GetParticularPrograms(id);
            if (programs == null)
                return NotFound();
            return Ok(programs);
        }

        // POST: api/Programs/Create
        [HttpPost("Create")]
        public ActionResult Create([FromBody] Programs programs)
        {
            if (programs == null)
                return BadRequest();
            _programsRepository.InsertPrograms(programs);
            return CreatedAtAction(nameof(Details),new{id=programs.Id},programs);
        }

        

    }
}
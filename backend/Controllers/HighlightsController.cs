using Microsoft.AspNetCore.Mvc;
using backend.DAL.Repositories;
using backend.Models;
using System.Collections.Generic;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HighlightsController: ControllerBase
    {
        private readonly HighlightsRepository _highlightsRepository = new HighlightsRepository();
    
        // GET: api/Highlights or api/Programs/Instructor
        [HttpGet]
        [HttpGet("Index")]
        public ActionResult<IEnumerable<Highlights>> Index()
        {
            var highlightss = _highlightsRepository.GetAllHighlightss();
            return Ok(highlightss);
        }

        // GET: api/Highlights/Details/{id}
        [HttpGet("Details/{id}")]
        public ActionResult<Highlights> Details(int id)
        {
            var highlights = _highlightsRepository.GetParticularHighlights(id);
            if (highlights == null)
                return NotFound();
            return Ok(highlights);
        }

        // POST: api/Highlights/Create
        [HttpPost("Create")]
        public ActionResult Create([FromBody] Highlights highlights)
        {
            if(highlights == null)
                return BadRequest();
            _highlightsRepository.InsertHighlights(highlights);
            return CreatedAtAction(nameof(Details),new{id=highlights.Id},highlights);
        } 

        // PUT: api/Highlights/Update/{id}
        [HttpPut("Update/{id}")]
        public ActionResult Update(int id, [FromBody] Highlights highlights)
        {
            if(highlights == null || highlights.Id != id)
                return BadRequest();

            var existing = _highlightsRepository.GetParticularHighlights(id);
            if (existing == null)
                return NotFound();
            _highlightsRepository.UpdateHighlights(highlights);
            return NoContent();
        }

        // DELETE: api/Highlights/Delete/{id}
        [HttpDelete("Delete/{id}")]
        public ActionResult Delete(int id)
        {
            var existing = _highlightsRepository.GetParticularHighlights(id);
            if (existing == null)
                return NotFound();
            _highlightsRepository.DeleteHighlights(id);
            return NoContent();
        }
    }



}
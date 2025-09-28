using Microsoft.AspNetCore.Mvc;
using backend.DAL.Repositories;
using backend.Models;
using System.Collections.Generic;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InstructorController: ControllerBase
    {
        private readonly InstructorRepository _instructorRepository = new InstructorRepository();
    }

    // GET: api/Instructor or api/Programs/Instructor
    [HttpGet]
    [HttpGet("Index")]
    public ActionResult<IEnumerable<Instructor>> Index()
    {
        var instructors = _instructorRepository.GetAllInstructors();
        return Ok(instructors);
    }

    // GET: api/Instructor/Details/{id}
    public ActionResult<Programs> Details(int id)
    {
        var instructor = _instructorRepository.GetParticularInstructor(id);
        if (instructor == null)
            return NotFound();
        return Ok(instructor);
    }

    // POST: api/Instructor/Create
    public ActionResult Create([FromBody] Instructor instructor)
    {
        if(instructor == null)
            return BadRequest();
        _instructorRepository.InsertInstructor(instructor);
        return CreatedAtAction(nameof(Instructor),new{id=instructor.Id},instructor);
    } 

    // PUT: api/Instructor/Update/{id}
    [HttpPut("Update/{id}")]
    public ActionResult Update(int id, [FromBody] Instructor instructor)
    {
        if(instructor == null || instructor.Id != id)
            return BadRequest();

        var existing = _programsRepository.GetParticularInstructor(id);
        if (existing == null)
            return NotFound();
        programsRepository.UpdateInstructor(instructor);
        return NoContent();
    }

    // DELETE: api/Instructor/Delete/{id}
    [HttpDelete("Delete/{id}")]
    public ActionResult Delete(int id)
    {
        var existing = _instructorRepository.GetParticularInstructor(id);
        if (existing == null)
            return NotFound();
        _instructorRepository.DeleteInstructor(id);
        return NoContent();
    }



}
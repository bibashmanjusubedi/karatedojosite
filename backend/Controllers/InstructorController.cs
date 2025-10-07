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
    

        // GET: api/Instructor or api/Programs/Instructor
        [HttpGet]
        [HttpGet("Index")]
        public ActionResult<IEnumerable<Instructor>> Index()
        {
            var instructors = _instructorRepository.GetAllInstructors();
            return Ok(instructors);
        }

        // GET: api/Instructor/Details/{id}
        [HttpGet("Details/{id}")]
        public ActionResult<Instructor> Details(int id)
        {
            var instructor = _instructorRepository.GetParticularInstructor(id);
            if (instructor == null)
                return NotFound();
            return Ok(instructor);
        }

        // POST: api/Instructor/Create
        [HttpPost("Create")]
        public async Task<ActionResult> Create([FromForm] InstructorCreateUpdateDto dto)
        {
            // if(instructor == null)
            //     return BadRequest();
            // _instructorRepository.InsertInstructor(instructor);
            // return CreatedAtAction(nameof(Details),new{id=instructor.Id},instructor);

            if (dto == null) return BadRequest();

            byte[] photoData = null;
            if (dto.Photo != null)
            {
                using var ms = new MemoryStream();
                await dto.Photo.CopyToAsync(ms);
                photoData = ms.ToArray();
            }

            var instructor = new Instructor
            {
                Name = dto.Name,
                Role = dto.Role,
                Phone = dto.Phone,
                Email = dto.Email,
                PhotoUrl = dto.PhotoUrl,
                Photo = photoData
            };

            _instructorRepository.InsertInstructor(instructor);
            return CreatedAtAction(nameof(Details),new{id=instructor.Id},instructor);

        } 

        // PUT: api/Instructor/Update/{id}
        [HttpPut("Update/{id}")]
        public async Task <ActionResult> Update(int id, [FromForm] InstructorCreateUpdateDto dto)
        {
            // if(instructor == null || instructor.Id != id)
            //     return BadRequest();

            // var existing = _instructorRepository.GetParticularInstructor(id);
            // if (existing == null)
            //     return NotFound();
            // _instructorRepository.UpdateInstructor(instructor);
            // return NoContent();

            if (dto == null || dto.Id != id) return BadRequest();
            var existing = _instructorRepository.GetParticularInstructor(id);
            if (existing == null) return NotFound();

            byte[] photoData = null;
            if (dto.Photo != null)
            {
                using var ms = new MemoryStream();
                await dto.Photo.CopyToAsync(ms);
                photoData = ms.ToArray();
            }

            var instructor = new Instructor
            {
                Id = id,
                Name = dto.Name,
                Role = dto.Role,
                Phone = dto.Phone,
                Email = dto.Email,
                PhotoUrl = dto.PhotoUrl,
                Photo = photoData
            };

            _instructorRepository.UpdateInstructor(instructor);
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



}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadsController : ControllerBase
    {
        private readonly ValedictorianDbContext _context;

        public UploadsController(ValedictorianDbContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpload")]
        public async Task<IActionResult> AddUpload([FromBody] Upload dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.UploadFormat))
                return BadRequest(new { Message = "UploadFormat is required." });

            var upload = new Upload
            {
                ReplyID = dto.ReplyID,
                UploadFormat = dto.UploadFormat
            };

            _context.Uploads.Add(upload);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Upload added successfully.",
                upload.UploadID
            });
        }

        [HttpGet("GetUploads")]
        public async Task<IActionResult> GetUploads()
        {
            var uploads = await _context.Uploads.ToListAsync();
            return Ok(uploads);
        }

        [HttpGet("GetUpload/{id}")]
        public async Task<IActionResult> GetUpload(int id)
        {
            var upload = await _context.Uploads.FindAsync(id);
            if (upload == null)
                return NotFound(new { Message = $"Upload with ID {id} not found." });

            return Ok(upload);
        }

        [HttpDelete("DeleteUpload/{id}")]
        public async Task<IActionResult> DeleteUpload(int id)
        {
            var upload = await _context.Uploads.FindAsync(id);
            if (upload == null)
                return NotFound(new { Message = "Upload not found." });

            _context.Uploads.Remove(upload);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Upload deleted successfully." });
        }
    }
}
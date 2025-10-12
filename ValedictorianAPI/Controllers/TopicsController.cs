using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TopicsController : ControllerBase
    {
        private readonly CampusLearnDbContext _context;

        public TopicsController(CampusLearnDbContext context)
        {
            _context = context;
        }

        // POST: api/Topics/Save
        [HttpPost("Save")]
        public async Task<IActionResult> SaveTopic([FromBody] TopicDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.TopicTitle) || dto.ModuleId == null)
                return BadRequest(new { Message = "Topic title and Module ID are required." });

            var module = await _context.Modules.FindAsync(dto.ModuleId);
            if (module == null)
                return NotFound(new { Message = "Module not found." });

            var topic = new Topic
            {
                TopicTitle = dto.TopicTitle,
                ModuleId = dto.ModuleId
            };

            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            return Ok(new { Message = $"Topic '{dto.TopicTitle}' saved successfully.", topic.TopicId });
        }

        // GET: api/Topics/GetByModule/5
        [HttpGet("GetByModule/{moduleId}")]
        public async Task<IActionResult> GetTopicsByModule(int moduleId)
        {
            var topics = await _context.Topics
                .Where(t => t.ModuleId == moduleId)
                .Select(t => new
                {
                    t.TopicId,
                    t.TopicTitle,
                    ModuleName = t.Module != null ? t.Module.ModuleName : "Unknown"
                })
                .ToListAsync();

            if (!topics.Any())
                return Ok(new { Message = "No topics found for this module." });

            return Ok(topics);
        }
    }

    public class TopicDto
    {
        public string TopicTitle { get; set; }
        public int? ModuleId { get; set; }
    }
}

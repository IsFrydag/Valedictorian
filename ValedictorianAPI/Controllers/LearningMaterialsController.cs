using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LearningMaterialsController : ControllerBase
    {
        private readonly CampusLearnDbContext _context;

        public LearningMaterialsController(CampusLearnDbContext context)
        {
            _context = context;
        }

        // POST: api/LearningMaterials/Upload
        [HttpPost("Upload")]
        public async Task<IActionResult> UploadLearningMaterial([FromBody] LearningMaterialDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.LearningMaterialTitle) || string.IsNullOrWhiteSpace(dto.TypeOfLearningMaterial))
                return BadRequest(new { Message = "Title and Type are required." });

            var material = new LearningMaterial
            {
                LearningMaterialTitle = dto.LearningMaterialTitle,
                TypeOfLearningMaterial = dto.TypeOfLearningMaterial,
                ReplyId = dto.ReplyId
            };

            _context.LearningMaterials.Add(material);
            await _context.SaveChangesAsync();

            return Ok(new { Message = $"Learning material '{dto.LearningMaterialTitle}' uploaded successfully.", material.LearningMaterialId });
        }

        // GET: api/LearningMaterials/GetAll
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllLearningMaterials()
        {
            var materials = await _context.LearningMaterials
                .Select(m => new
                {
                    m.LearningMaterialId,
                    m.LearningMaterialTitle,
                    m.TypeOfLearningMaterial,
                    m.ReplyId
                })
                .ToListAsync();

            if (!materials.Any())
                return Ok(new { Message = "No learning materials found." });

            return Ok(materials);
        }
    }

    public class LearningMaterialDto
    {
        public string LearningMaterialTitle { get; set; }
        public string TypeOfLearningMaterial { get; set; }
        public int? ReplyId { get; set; }
    }
}

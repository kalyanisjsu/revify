package com.revify.controller;

import com.revify.dto.LatestReviewDTO;
import com.revify.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by Vijaya on 3/24/2015.
 */
@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @RequestMapping(method = RequestMethod.GET, params = "range=latest", produces = "application/json")
    public List<LatestReviewDTO> getLatestReviews(@RequestParam(required = true, value = "categoryID") Long categoryID){
            return reviewService.getLatestReviews(categoryID);
    }
}